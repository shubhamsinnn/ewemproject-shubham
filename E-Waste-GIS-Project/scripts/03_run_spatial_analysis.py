"""
03_run_spatial_analysis.py
--------------------------
Performs rigorous GIS spatial analysis on Mumbai e-waste data:
1. Reprojection to UTM Zone 43N (EPSG:32643) for meter-accurate Euclidean analysis.
2. Buffer Analysis (500m, 1km, 2km service radii around formal facilities).
3. Nearest Neighbor Distance Analysis:
   - Exact planar distance from every source point to the nearest authorized collection/recycling facility.
   - Ward-level centroid distance and spatial service coverage deficit (% of ward area outside 1km buffer).
4. Kernel Density Estimation (KDE) of potential e-waste sources weighted by generation.
5. Construction and export of the Master Spatial Dataset (CSV & GeoJSON).
"""

import os
import json
import numpy as np
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point, box
from scipy.spatial import cKDTree
from scipy.stats import gaussian_kde

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")
LAYERS_DIR = os.path.join(BASE_DIR, "gis", "layers")

def main():
    print("--- Starting GIS Spatial Analysis for Mumbai E-Waste ---")

    # Load administrative wards
    wards_path = os.path.join(PROCESSED_DIR, "mumbai_wards_epsg4326.geojson")
    wards_gdf = gpd.read_file(wards_path)
    wards_utm = wards_gdf.to_crs(epsg=32643)

    # Load sources and facilities
    sources_path = os.path.join(PROCESSED_DIR, "ewaste_sources_points.geojson")
    sources_gdf = gpd.read_file(sources_path)
    sources_utm = sources_gdf.to_crs(epsg=32643)

    facilities_path = os.path.join(PROCESSED_DIR, "ewaste_facilities_points.geojson")
    facilities_gdf = gpd.read_file(facilities_path)
    facilities_utm = facilities_gdf.to_crs(epsg=32643)

    # Separate collection centers vs recycling facilities
    recyclers_utm = facilities_utm[facilities_utm["type"].str.contains("Recycling", case=False, na=False)]
    if recyclers_utm.empty:
        recyclers_utm = facilities_utm.iloc[[-1]]  # Regional facility

    collection_centers_utm = facilities_utm[~facilities_utm.index.isin(recyclers_utm.index)]
    if collection_centers_utm.empty:
        collection_centers_utm = facilities_utm

    # 1. BUFFER ANALYSIS (500m, 1km, 2km)
    print("\n[Step 1] Computing Service Buffers around Authorized Facilities...")
    buffers_500m = facilities_utm.copy()
    buffers_500m["geometry"] = buffers_500m.geometry.buffer(500)
    buffers_500m["buffer_radius"] = "500m (Immediate Walking Catchment)"

    buffers_1km = facilities_utm.copy()
    buffers_1km["geometry"] = buffers_1km.geometry.buffer(1000)
    buffers_1km["buffer_radius"] = "1km (Neighborhood Catchment)"

    buffers_2km = facilities_utm.copy()
    buffers_2km["geometry"] = buffers_2km.geometry.buffer(2000)
    buffers_2km["buffer_radius"] = "2km (Maximum Suburban Drop Catchment)"

    # Export buffer layers (both UTM and WGS84 for WebGIS/QGIS)
    buffers_500m.to_crs(epsg=4326).to_file(os.path.join(LAYERS_DIR, "facility_buffers_500m.geojson"), driver="GeoJSON")
    buffers_1km.to_crs(epsg=4326).to_file(os.path.join(LAYERS_DIR, "facility_buffers_1km.geojson"), driver="GeoJSON")
    buffers_2km.to_crs(epsg=4326).to_file(os.path.join(LAYERS_DIR, "facility_buffers_2km.geojson"), driver="GeoJSON")
    print("Exported 500m, 1km, and 2km buffer GeoJSON layers.")

    # Dissolved buffer for service coverage assessment
    dissolved_1km = buffers_1km.geometry.union_all()
    dissolved_2km = buffers_2km.geometry.union_all()

    # 2. NEAREST DISTANCE ANALYSIS (Point Sources -> Facilities)
    print("\n[Step 2] Computing Nearest Facility Distances for Source Points...")
    fac_coords = np.array([[g.x, g.y] for g in facilities_utm.geometry])
    tree_all_fac = cKDTree(fac_coords)

    col_coords = np.array([[g.x, g.y] for g in collection_centers_utm.geometry])
    tree_col = cKDTree(col_coords)

    rec_coords = np.array([[g.x, g.y] for g in recyclers_utm.geometry])
    tree_rec = cKDTree(rec_coords)

    src_coords = np.array([[g.x, g.y] for g in sources_utm.geometry])

    dist_to_col, _ = tree_col.query(src_coords)
    dist_to_rec, _ = tree_rec.query(src_coords)
    dist_to_any, idx_nearest = tree_all_fac.query(src_coords)

    sources_gdf["Distance_to_Collection_Centre"] = np.round(dist_to_col / 1000.0, 2)  # km
    sources_gdf["Distance_to_Recycling_Centre"] = np.round(dist_to_rec / 1000.0, 2)   # km
    sources_gdf["Nearest_Facility_Name"] = facilities_utm.iloc[idx_nearest]["name"].values
    sources_gdf["Nearest_Facility_Distance_km"] = np.round(dist_to_any / 1000.0, 2)

    # 3. WARD-LEVEL DISTANCE & SERVICE ACCESSIBILITY DEFICIT
    print("\n[Step 3] Analyzing Ward Centroid Proximity & Service Deficit...")
    ward_centroids = np.array([[g.centroid.x, g.centroid.y] for g in wards_utm.geometry])
    ward_dist_col, _ = tree_col.query(ward_centroids)
    ward_dist_rec, _ = tree_rec.query(ward_centroids)

    wards_gdf["dist_to_col_km"] = np.round(ward_dist_col / 1000.0, 2)
    wards_gdf["dist_to_rec_km"] = np.round(ward_dist_rec / 1000.0, 2)

    # Calculate spatial coverage deficit: % of ward area NOT covered by 1km buffer
    service_deficit_pct = []
    service_deficit_2km_pct = []
    for _, w_row in wards_utm.iterrows():
        w_geom = w_row.geometry
        w_area = w_geom.area

        # Intersection with 1km buffer
        inter_1km = w_geom.intersection(dissolved_1km)
        served_1km_area = inter_1km.area if not inter_1km.is_empty else 0.0
        unserved_1km_pct = max(0.0, min(100.0, (1.0 - (served_1km_area / w_area)) * 100.0))
        service_deficit_pct.append(round(unserved_1km_pct, 1))

        # Intersection with 2km buffer
        inter_2km = w_geom.intersection(dissolved_2km)
        served_2km_area = inter_2km.area if not inter_2km.is_empty else 0.0
        unserved_2km_pct = max(0.0, min(100.0, (1.0 - (served_2km_area / w_area)) * 100.0))
        service_deficit_2km_pct.append(round(unserved_2km_pct, 1))

    wards_gdf["unserved_area_1km_pct"] = service_deficit_pct
    wards_gdf["unserved_area_2km_pct"] = service_deficit_2km_pct

    # 4. SPATIAL AGGREGATION OF E-WASTE SOURCES PER WARD
    print("\n[Step 4] Aggregating Point Sources to Administrative Wards...")
    # Count sources per ward and sum monthly generation
    sources_per_ward = sources_gdf.groupby("Ward").agg(
        num_sources=("ID", "count"),
        total_source_ewaste_kg=("Estimated_Monthly_EWaste_kg", "sum"),
        avg_source_ewaste_kg=("Estimated_Monthly_EWaste_kg", "mean"),
        high_risk_sources=("Disposal_Risk", lambda s: (s.isin(["High", "Very High"])).sum())
    ).reset_index()

    wards_gdf = wards_gdf.merge(sources_per_ward, left_on="name", right_on="Ward", how="left")
    wards_gdf["num_sources"] = wards_gdf["num_sources"].fillna(0).astype(int)
    wards_gdf["total_source_ewaste_kg"] = wards_gdf["total_source_ewaste_kg"].fillna(0).round(1)
    wards_gdf["high_risk_sources"] = wards_gdf["high_risk_sources"].fillna(0).astype(int)

    # 5. KERNEL DENSITY ESTIMATION (KDE) GRID
    print("\n[Step 5] Performing Kernel Density Estimation (KDE) Grid Analysis...")
    # Create bounding box grid over Mumbai in UTM coordinates
    minx, miny, maxx, maxy = wards_utm.total_bounds
    grid_res = 500.0  # 500m spatial cell resolution
    x_coords = np.arange(minx, maxx + grid_res, grid_res)
    y_coords = np.arange(miny, maxy + grid_res, grid_res)
    xx, yy = np.meshgrid(x_coords, y_coords)
    grid_points = np.vstack([xx.ravel(), yy.ravel()])

    # Weighted KDE by monthly e-waste generation
    src_xy = np.vstack([sources_utm.geometry.x, sources_utm.geometry.y])
    weights = sources_utm["Estimated_Monthly_EWaste_kg"].values
    weights_norm = weights / weights.sum()

    kde = gaussian_kde(src_xy, weights=weights_norm, bw_method=0.18)
    kde_values = kde(grid_points).reshape(xx.shape)

    # Normalize KDE to 0 - 100 relative density index
    kde_min, kde_max = kde_values.min(), kde_values.max()
    kde_normalized = ((kde_values - kde_min) / (kde_max - kde_min) * 100.0)

    # Mask KDE grid with Mumbai boundary
    mumbai_poly = wards_utm.geometry.union_all()
    kde_cells = []
    for i in range(len(y_coords) - 1):
        for j in range(len(x_coords) - 1):
            cell_box = box(x_coords[j], y_coords[i], x_coords[j+1], y_coords[i+1])
            if cell_box.intersects(mumbai_poly):
                cell_density = kde_normalized[i, j]
                kde_cells.append({
                    "density_score": round(float(cell_density), 2),
                    "geometry": cell_box
                })

    gdf_kde_grid = gpd.GeoDataFrame(kde_cells, crs="EPSG:32643")
    gdf_kde_grid_wgs = gdf_kde_grid.to_crs(epsg=4326)
    kde_grid_path = os.path.join(LAYERS_DIR, "ewaste_kde_density_grid.geojson")
    gdf_kde_grid_wgs.to_file(kde_grid_path, driver="GeoJSON")
    print(f"Exported KDE density grid with {len(gdf_kde_grid)} cells.")

    # 6. EXPORT MASTER DATA TABLE (CSV & GeoJSON)
    # Reorganize master dataset columns in exact order requested in Section 6
    master_cols = [
        "ID", "Location_Name", "Latitude", "Longitude", "Ward", "Location_Type",
        "E_Waste_Type", "Estimated_Monthly_EWaste_kg", "Population", "Population_Density",
        "Commercial_Index", "Industrial_Index", "Distance_to_Recycling_Centre",
        "Distance_to_Collection_Centre", "Disposal_Risk", "Survey_Source", "Data_Source", "Remarks"
    ]
    df_master = sources_gdf[master_cols].copy()
    master_csv_path = os.path.join(PROCESSED_DIR, "master_ewaste_spatial_dataset.csv")
    df_master.to_csv(master_csv_path, index=False)
    print(f"\n[Step 6] Exported Master Data Table: {master_csv_path} ({len(df_master)} records)")

    # Save enriched sources GeoJSON and Shapefile
    enriched_sources_json = os.path.join(LAYERS_DIR, "ewaste_sources_enriched.geojson")
    sources_gdf.to_file(enriched_sources_json, driver="GeoJSON")

    # Save enriched wards GeoJSON
    enriched_wards_json = os.path.join(PROCESSED_DIR, "mumbai_wards_enriched.geojson")
    wards_gdf.to_file(enriched_wards_json, driver="GeoJSON")
    wards_gdf.to_file(os.path.join(LAYERS_DIR, "mumbai_wards_analyzed.geojson"), driver="GeoJSON")

    print("\nSpatial Analysis complete! Summary statistics across 24 Wards:")
    print(wards_gdf[["name", "ward_name", "dist_to_col_km", "unserved_area_1km_pct", "num_sources", "total_source_ewaste_kg"]].head(8))

if __name__ == "__main__":
    main()
