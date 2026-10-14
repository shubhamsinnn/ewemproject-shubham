"""
05_generate_publication_maps.py
-------------------------------
Generates publication-quality, 300-DPI cartographic maps for all 8 mandatory maps:
- Map 1: Study Area Location Map (Mumbai MCGM 24 Administrative Wards & Zones)
- Map 2: Distribution of Potential E-Waste Sources (Classified by facility type)
- Map 3: E-Waste Collection and Recycling Facilities with Service Buffers (500m, 1km, 2km)
- Map 4: Population Density Choropleth Map (Persons / sq km)
- Map 5: Estimated E-Waste Generation Choropleth Map (Metric tons / month)
- Map 6: E-Waste Source Kernel Density Estimation (KDE Heatmap Surface)
- Map 7: Accessibility Deficit to Formal Facilities (Distance & Unserved Area %)
- Map 8: Final E-Waste Hotspot Risk Map (Multi-Criteria EHI Index Classification)

Each map includes:
- Professional neatline layout
- Standard Title & Subtitle
- Dynamic Legend
- True-to-scale Scale Bar (in km)
- North Arrow
- Grid / Coordinate Graticules
- Author, CRS (EPSG:32643 UTM Zone 43N) and Data Sources metadata
"""

import os
import numpy as np
import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from shapely.geometry import Point
from matplotlib.lines import Line2D
from matplotlib.colors import ListedColormap, Normalize
from mpl_toolkits.axes_grid1.anchored_artists import AnchoredSizeBar
import matplotlib.font_manager as fm

# Matplotlib global styling for academic publication
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['figure.autolayout'] = False

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")
LAYERS_DIR = os.path.join(BASE_DIR, "gis", "layers")
MAPS_DIR = os.path.join(BASE_DIR, "maps")

def add_cartographic_elements(ax, crs_name="EPSG:32643 (UTM Zone 43N)", data_src="MCGM, MPCB & Field Demonstration Data"):
    """Adds standard north arrow, scale bar, graticules, and metadata stamp."""
    # North Arrow
    ax.annotate(
        'N', xy=(0.94, 0.93), xytext=(0.94, 0.86),
        xycoords='axes fraction',
        ha='center', va='bottom',
        fontsize=13, fontweight='bold', color='#111827',
        arrowprops=dict(facecolor='#1e293b', edgecolor='black', width=3, headwidth=9, headlength=11)
    )

    # Scale Bar (10 km scale bar for Mumbai UTM Zone 43N)
    scale_bar_len_m = 10000  # 10 km
    scalebar = AnchoredSizeBar(
        ax.transData,
        scale_bar_len_m,
        '10 km',
        'lower left',
        pad=0.6,
        color='#1e293b',
        frameon=True,
        size_vertical=350,
        fontproperties=fm.FontProperties(size=9, weight='bold')
    )
    ax.add_artist(scalebar)

    # Metadata Stamp Box at bottom right
    meta_text = (
        f"Project: GIS E-Waste Hotspot Analysis\n"
        f"Study Area: Mumbai (MCGM / BMC)\n"
        f"CRS: {crs_name} | Datum: WGS 84\n"
        f"Sources: {data_src}"
    )
    ax.text(
        0.98, 0.02, meta_text,
        transform=ax.transAxes,
        fontsize=7.5,
        color="#334155",
        ha="right", va="bottom",
        bbox=dict(boxstyle="round,pad=0.4", facecolor="white", edgecolor="#cbd5e1", alpha=0.92)
    )

    # Gridlines
    ax.grid(color="#94a3b8", linestyle="--", linewidth=0.5, alpha=0.4)
    ax.set_xlabel("Easting (m)", fontsize=9, color="#475569")
    ax.set_ylabel("Northing (m)", fontsize=9, color="#475569")
    ax.tick_params(axis="both", which="major", labelsize=8, colors="#475569")

def main():
    print("--- Generating Publication Maps (300 DPI) for Mumbai E-Waste GIS Project ---")
    
    # Load Analyzed Layers in UTM Zone 43N
    wards_path = os.path.join(PROCESSED_DIR, "mumbai_wards_ehi_results.geojson")
    wards_gdf = gpd.read_file(wards_path).to_crs(epsg=32643)

    sources_path = os.path.join(LAYERS_DIR, "ewaste_sources_enriched.geojson")
    sources_gdf = gpd.read_file(sources_path).to_crs(epsg=32643)

    facilities_path = os.path.join(LAYERS_DIR, "ewaste_facilities_points.geojson")
    facilities_gdf = gpd.read_file(facilities_path).to_crs(epsg=32643)

    buf_500m = gpd.read_file(os.path.join(LAYERS_DIR, "facility_buffers_500m.geojson")).to_crs(epsg=32643)
    buf_1km = gpd.read_file(os.path.join(LAYERS_DIR, "facility_buffers_1km.geojson")).to_crs(epsg=32643)
    buf_2km = gpd.read_file(os.path.join(LAYERS_DIR, "facility_buffers_2km.geojson")).to_crs(epsg=32643)

    kde_grid = gpd.read_file(os.path.join(LAYERS_DIR, "ewaste_kde_density_grid.geojson")).to_crs(epsg=32643)

    # -------------------------------------------------------------
    # MAP 1: Study Area Location Map
    # -------------------------------------------------------------
    print("Generating Map 1: Study Area Location Map...")
    fig, ax = plt.subplots(figsize=(10, 12), dpi=300)
    fig.patch.set_facecolor('#f8fafc')
    ax.set_facecolor('#f1f5f9')

    # Color by Administrative Zone
    zone_colors = {
        "South Mumbai (City)": "#bfdbfe",
        "Western Suburbs": "#fed7aa",
        "Eastern Suburbs": "#bbf7d0"
    }
    wards_gdf["zone_color"] = wards_gdf["zone"].map(zone_colors)
    wards_gdf.plot(ax=ax, color=wards_gdf["zone_color"], edgecolor="#334155", linewidth=1.1)

    # Add Ward Labels
    for _, row in wards_gdf.iterrows():
        cent = row.geometry.centroid
        ax.text(
            cent.x, cent.y, row["name"],
            fontsize=8.5, fontweight='bold', color="#0f172a",
            ha="center", va="center",
            bbox=dict(boxstyle="circle,pad=0.2", facecolor="white", edgecolor="#64748b", alpha=0.75, linewidth=0.6)
        )

    # Custom Legend for Zones
    zone_patches = [
        mpatches.Patch(facecolor=color, edgecolor="#334155", label=f"{zone} ({len(wards_gdf[wards_gdf['zone']==zone])} Wards)")
        for zone, color in zone_colors.items()
    ]
    ax.legend(handles=zone_patches, title="Administrative Zones", loc="upper left", framealpha=0.95, fontsize=8.5, title_fontsize=9.5)

    ax.set_title("MAP 1: STUDY AREA ADMINISTRATIVE LOCATION MAP\nGreater Mumbai (MCGM / BMC 24 Municipal Wards)", fontsize=13, fontweight='bold', pad=14, color="#0f172a")
    add_cartographic_elements(ax)

    m1_path = os.path.join(MAPS_DIR, "study_area", "map1_study_area_location.png")
    plt.tight_layout()
    plt.savefig(m1_path, dpi=300, facecolor=fig.get_facecolor(), bbox_inches='tight')
    plt.close()
    print(f"Saved: {m1_path}")

    # -------------------------------------------------------------
    # MAP 2: Distribution of Potential E-Waste Sources
    # -------------------------------------------------------------
    print("Generating Map 2: Potential E-Waste Sources...")
    fig, ax = plt.subplots(figsize=(10, 12), dpi=300)
    fig.patch.set_facecolor('#f8fafc')
    ax.set_facecolor('#f8fafc')

    wards_gdf.plot(ax=ax, facecolor="#f1f5f9", edgecolor="#64748b", linewidth=0.9)

    # Group source types into high-level cartographic categories
    type_group_colors = {
        "Informal Scrap Dealer Hub": ("#ef4444", 75, "s", "Informal Scrap & Dismantling"),
        "Local Scrap Aggregator (Kabadiwala)": ("#f97316", 55, "s", "Informal Scrap & Dismantling"),
        "Reported Dumping Location": ("#b91c1c", 85, "X", "Reported Dumping / Accumulation"),
        "Electronics Wholesale & Retail Cluster": ("#6366f1", 60, "o", "Electronics Commercial & Wholesale"),
        "Electronics Retail Showroom": ("#3b82f6", 40, "o", "Electronics Retail & Showrooms"),
        "Neighborhood Electronics Retailer": ("#60a5fa", 35, "o", "Electronics Retail & Showrooms"),
        "Corporate IT Office": ("#10b981", 55, "^", "Corporate IT & Commercial Offices"),
        "Commercial Office Complex": ("#34d399", 45, "^", "Corporate IT & Commercial Offices"),
        "Electronics Assembly & IT SEZ": ("#8b5cf6", 90, "D", "Electronics Assembly & IT SEZ"),
        "Industrial Area": ("#a855f7", 50, "D", "Industrial Zones"),
        "Electronic Repair Centre": ("#ec4899", 50, "P", "Electronics & Mobile Repair Shops"),
        "Mobile Phone & Laptop Repair Shop": ("#f43f5e", 40, "P", "Electronics & Mobile Repair Shops"),
        "Computer Hardware Store & Spares": ("#06b6d4", 40, "o", "Computer Hardware & Spares"),
        "Educational Institution": ("#14b8a6", 50, "*", "Institutional (Colleges / Hospitals)"),
        "Healthcare / Hospital": ("#0d9488", 50, "*", "Institutional (Colleges / Hospitals)"),
        "Polytechnic / College Computer Lab": ("#2dd4bf", 35, "*", "Institutional (Colleges / Hospitals)"),
        "Commercial SME Office": ("#94a3b8", 30, "^", "Commercial SME Offices"),
        "Commercial Retail": ("#cbd5e1", 30, "o", "General Commercial")
    }

    # Plot by major group
    legend_groups = {}
    for _, src in sources_gdf.iterrows():
        l_type = src["Location_Type"]
        color, size, marker, grp_label = type_group_colors.get(l_type, ("#64748b", 30, "o", "Other Sources"))
        ax.scatter(src.geometry.x, src.geometry.y, c=color, s=size, marker=marker, edgecolors="black", linewidth=0.5, alpha=0.88, zorder=4)
        if grp_label not in legend_groups:
            legend_groups[grp_label] = (color, marker)

    # Highlight iconic hotspots (Lamington Rd, SEEPZ, Dharavi, Kurla CST Rd)
    callouts = [
        ("Lamington Road", 18.9612, 72.8174, 2500, -1000),
        ("SEEPZ IT SEZ", 19.1245, 72.8790, 3000, 1000),
        ("Dharavi Scrap Cluster", 19.0435, 72.8540, -4500, 1500),
        ("Kurla CST Scrap Market", 19.0720, 72.8810, 3500, -1500),
        ("Govandi / Deonar Vicinity", 19.0520, 72.9180, 2000, 2000)
    ]
    # Callout coords in UTM Zone 43N
    callout_gdf = gpd.GeoDataFrame([
        {"label": name, "geometry": Point(lon, lat), "dx": dx, "dy": dy}
        for name, lat, lon, dx, dy in callouts
    ], crs="EPSG:4326").to_crs(epsg=32643)

    for _, c_row in callout_gdf.iterrows():
        ax.annotate(
            c_row["label"], xy=(c_row.geometry.x, c_row.geometry.y),
            xytext=(c_row.geometry.x + c_row["dx"], c_row.geometry.y + c_row["dy"]),
            fontsize=8, fontweight='bold', color="#991b1b",
            arrowprops=dict(arrowstyle="->", color="#b91c1c", lw=1.2),
            bbox=dict(boxstyle="round,pad=0.25", facecolor="#fef2f2", edgecolor="#f87171", alpha=0.95),
            zorder=6
        )

    # Legend
    legend_handles = [
        Line2D([0], [0], marker=mk, color='w', markerfacecolor=col, markeredgecolor='k', markersize=8, label=lbl)
        for lbl, (col, mk) in legend_groups.items()
    ]
    ax.legend(handles=legend_handles, title="E-Waste Source Categories", loc="upper left", framealpha=0.95, fontsize=8, title_fontsize=9)

    ax.set_title("MAP 2: DISTRIBUTION OF POTENTIAL E-WASTE SOURCES\nSpatial Distribution of Retail, Repair, IT Parks, and Informal Scrap Aggregators", fontsize=12.5, fontweight='bold', pad=14, color="#0f172a")
    add_cartographic_elements(ax)

    m2_path = os.path.join(MAPS_DIR, "source_distribution", "map2_ewaste_sources_distribution.png")
    plt.tight_layout()
    plt.savefig(m2_path, dpi=300, facecolor=fig.get_facecolor(), bbox_inches='tight')
    plt.close()
    print(f"Saved: {m2_path}")

    # -------------------------------------------------------------
    # MAP 3: E-Waste Facilities & Service Buffers
    # -------------------------------------------------------------
    print("Generating Map 3: Facilities & Service Coverage Buffers...")
    fig, ax = plt.subplots(figsize=(10, 12), dpi=300)
    fig.patch.set_facecolor('#f8fafc')
    ax.set_facecolor('#f8fafc')

    wards_gdf.plot(ax=ax, facecolor="#f8fafc", edgecolor="#475569", linewidth=0.9)

    # Buffers (2km, 1km, 500m)
    buf_2km.plot(ax=ax, facecolor="#c7d2fe", edgecolor="#818cf8", alpha=0.35, linewidth=0.8, zorder=2)
    buf_1km.plot(ax=ax, facecolor="#a5b4fc", edgecolor="#6366f1", alpha=0.50, linewidth=1.0, zorder=3)
    buf_500m.plot(ax=ax, facecolor="#6366f1", edgecolor="#4338ca", alpha=0.65, linewidth=1.2, zorder=4)

    # Facilities Points
    facilities_gdf.plot(ax=ax, color="#1e1b4b", edgecolor="#ffffff", linewidth=1.2, markersize=80, marker="P", zorder=5)

    # Annotate facilities
    for _, fac in facilities_gdf.iterrows():
        # Short label
        s_lbl = fac["name"].split(" ")[0] + " " + fac["ward"]
        ax.text(
            fac.geometry.x + 400, fac.geometry.y + 400, fac["name"].split("(")[0].strip()[:24],
            fontsize=6.5, fontweight='bold', color="#1e1b4b",
            bbox=dict(boxstyle="round,pad=0.15", facecolor="#ffffff", edgecolor="#cbd5e1", alpha=0.85),
            zorder=6
        )

    # Buffer Legend
    buf_patches = [
        mpatches.Patch(facecolor="#6366f1", edgecolor="#4338ca", alpha=0.65, label="500 m Buffer (Immediate Walking Drop-off)"),
        mpatches.Patch(facecolor="#a5b4fc", edgecolor="#6366f1", alpha=0.50, label="1000 m (1 km) Buffer (Neighborhood Catchment)"),
        mpatches.Patch(facecolor="#c7d2fe", edgecolor="#818cf8", alpha=0.35, label="2000 m (2 km) Buffer (Suburban Service Limit)"),
        Line2D([0], [0], marker="P", color='w', markerfacecolor="#1e1b4b", markeredgecolor='w', markersize=10, label=f"Authorized E-Waste Facility (n={len(facilities_gdf)})")
    ]
    ax.legend(handles=buf_patches, title="Formal Facility Service Radii", loc="upper left", framealpha=0.95, fontsize=8, title_fontsize=9)

    ax.set_title("MAP 3: AUTHORIZED E-WASTE MANAGEMENT FACILITIES & SERVICE BUFFERS\nSpatial Coverage around MPCB Registered Recyclers & PRO Collection Centers", fontsize=12.5, fontweight='bold', pad=14, color="#0f172a")
    add_cartographic_elements(ax)

    m3_path = os.path.join(MAPS_DIR, "facility_accessibility", "map3_collection_recycling_facilities_buffers.png")
    plt.tight_layout()
    plt.savefig(m3_path, dpi=300, facecolor=fig.get_facecolor(), bbox_inches='tight')
    plt.close()
    print(f"Saved: {m3_path}")

    # -------------------------------------------------------------
    # MAP 4: Population Density Choropleth
    # -------------------------------------------------------------
    print("Generating Map 4: Population Density Choropleth...")
    fig, ax = plt.subplots(figsize=(10, 12), dpi=300)
    fig.patch.set_facecolor('#f8fafc')
    ax.set_facecolor('#f8fafc')

    wards_gdf["pop_density_thousands"] = wards_gdf["pop_density_sqkm"] / 1000.0
    im4 = wards_gdf.plot(
        column="pop_density_thousands",
        cmap="YlOrRd",
        edgecolor="#334155",
        linewidth=0.9,
        legend=True,
        legend_kwds={'label': "Population Density ('000 Persons / sq km)", 'orientation': "horizontal", 'shrink': 0.65, 'pad': 0.05},
        ax=ax
    )

    # Ward Labels
    for _, row in wards_gdf.iterrows():
        cent = row.geometry.centroid
        ax.text(
            cent.x, cent.y, f"{row['name']}\n{row['pop_density_thousands']:.1f}k",
            fontsize=7, fontweight='bold', color="#0f172a",
            ha="center", va="center",
            bbox=dict(boxstyle="round,pad=0.15", facecolor="white", edgecolor="#94a3b8", alpha=0.7, linewidth=0.5)
        )

    ax.set_title("MAP 4: POPULATION DENSITY DISTRIBUTION\nWard-Level Population Concentration (MCGM Census Baseline)", fontsize=13, fontweight='bold', pad=14, color="#0f172a")
    add_cartographic_elements(ax)

    m4_path = os.path.join(MAPS_DIR, "density", "map4_population_density.png")
    plt.tight_layout()
    plt.savefig(m4_path, dpi=300, facecolor=fig.get_facecolor(), bbox_inches='tight')
    plt.close()
    print(f"Saved: {m4_path}")

    # -------------------------------------------------------------
    # MAP 5: Estimated E-Waste Generation Choropleth
    # -------------------------------------------------------------
    print("Generating Map 5: Estimated E-Waste Generation...")
    fig, ax = plt.subplots(figsize=(10, 12), dpi=300)
    fig.patch.set_facecolor('#f8fafc')
    ax.set_facecolor('#f8fafc')

    wards_gdf.plot(
        column="est_monthly_ewaste_tons",
        cmap="Purples",
        edgecolor="#334155",
        linewidth=0.9,
        legend=True,
        legend_kwds={'label': "Estimated Monthly E-Waste Generation (Metric Tons / Month)", 'orientation': "horizontal", 'shrink': 0.65, 'pad': 0.05},
        ax=ax
    )

    for _, row in wards_gdf.iterrows():
        cent = row.geometry.centroid
        ax.text(
            cent.x, cent.y, f"{row['name']}\n{int(row['est_monthly_ewaste_tons'])}T",
            fontsize=7, fontweight='bold', color="#1e1b4b",
            ha="center", va="center",
            bbox=dict(boxstyle="round,pad=0.15", facecolor="white", edgecolor="#cbd5e1", alpha=0.75, linewidth=0.5)
        )

    ax.set_title("MAP 5: ESTIMATED E-WASTE GENERATION BY MUNICIPAL WARD\nBaseline Material Volume Flow (Metric Tons / Month)", fontsize=13, fontweight='bold', pad=14, color="#0f172a")
    add_cartographic_elements(ax)

    m5_path = os.path.join(MAPS_DIR, "density", "map5_estimated_ewaste_generation.png")
    plt.tight_layout()
    plt.savefig(m5_path, dpi=300, facecolor=fig.get_facecolor(), bbox_inches='tight')
    plt.close()
    print(f"Saved: {m5_path}")

    # -------------------------------------------------------------
    # MAP 6: E-Waste Source Kernel Density Estimation (KDE Heatmap)
    # -------------------------------------------------------------
    print("Generating Map 6: E-Waste Source Kernel Density Surface...")
    fig, ax = plt.subplots(figsize=(10, 12), dpi=300)
    fig.patch.set_facecolor('#f8fafc')
    ax.set_facecolor('#f8fafc')

    # Base ward outlines
    wards_gdf.plot(ax=ax, facecolor="none", edgecolor="#475569", linewidth=0.7, zorder=3)

    # Plot KDE Grid
    kde_plot = kde_grid.plot(
        column="density_score",
        cmap="inferno",
        alpha=0.82,
        legend=True,
        legend_kwds={'label': "Kernel Density Intensity (Relative Scale 0 - 100)", 'orientation': "horizontal", 'shrink': 0.65, 'pad': 0.05},
        ax=ax,
        zorder=2
    )

    # Superimpose high-volume sources as subtle points
    sources_gdf.plot(ax=ax, color="#ffffff", markersize=6, alpha=0.6, zorder=4)

    # Labels for highest density cores
    top_cores = [
        ("Core 1: South Hub\n(Lamington / Chor Bazaar)", 18.955, 72.825),
        ("Core 2: Andheri-SEEPZ\nIndustrial Tech Core", 19.120, 72.875),
        ("Core 3: Kurla-Dharavi\nInformal Dismantling", 19.055, 72.865)
    ]
    core_gdf = gpd.GeoDataFrame([
        {"label": lbl, "geometry": Point(lon, lat)} for lbl, lat, lon in top_cores
    ], crs="EPSG:4326").to_crs(epsg=32643)

    for _, c in core_gdf.iterrows():
        ax.text(
            c.geometry.x, c.geometry.y, c["label"],
            fontsize=7.5, fontweight='bold', color="#ffffff",
            ha="center", va="center",
            bbox=dict(boxstyle="round,pad=0.25", facecolor="#09090b", edgecolor="#fbbf24", alpha=0.9, linewidth=1.0),
            zorder=5
        )

    ax.set_title("MAP 6: E-WASTE SOURCE KERNEL DENSITY ESTIMATION (HEATMAP)\nPoint Intensity Weighted by Estimated Generation and Risk Activity", fontsize=12.5, fontweight='bold', pad=14, color="#0f172a")
    add_cartographic_elements(ax)

    m6_path = os.path.join(MAPS_DIR, "density", "map6_ewaste_source_kernel_density.png")
    plt.tight_layout()
    plt.savefig(m6_path, dpi=300, facecolor=fig.get_facecolor(), bbox_inches='tight')
    plt.close()
    print(f"Saved: {m6_path}")

    # -------------------------------------------------------------
    # MAP 7: Accessibility Deficit Map
    # -------------------------------------------------------------
    print("Generating Map 7: Accessibility Deficit to Formal Facilities...")
    fig, ax = plt.subplots(figsize=(10, 12), dpi=300)
    fig.patch.set_facecolor('#f8fafc')
    ax.set_facecolor('#f8fafc')

    # Color wards by distance to nearest facility
    wards_gdf.plot(
        column="dist_to_col_km",
        cmap="Blues",
        edgecolor="#334155",
        linewidth=0.9,
        legend=True,
        legend_kwds={'label': "Euclidean Distance from Ward Centroid to Nearest Formal Facility (km)", 'orientation': "horizontal", 'shrink': 0.65, 'pad': 0.05},
        ax=ax
    )

    # Plot 1km buffers in hatched or distinct overlay
    buf_1km.plot(ax=ax, facecolor="none", edgecolor="#10b981", linewidth=1.2, linestyle="--", zorder=3)
    facilities_gdf.plot(ax=ax, color="#059669", edgecolor="#ffffff", linewidth=1.2, markersize=70, marker="P", zorder=4)

    # Label wards with high service deficit (>70% unserved)
    for _, row in wards_gdf.iterrows():
        cent = row.geometry.centroid
        is_severe = row["unserved_area_1km_pct"] > 70.0
        ax.text(
            cent.x, cent.y, f"{row['name']}\n{row['dist_to_col_km']:.1f}km\n({row['unserved_area_1km_pct']:.0f}% unserved)",
            fontsize=6.5, fontweight='bold', color="#991b1b" if is_severe else "#0f172a",
            ha="center", va="center",
            bbox=dict(boxstyle="round,pad=0.15", facecolor="#fef2f2" if is_severe else "white", edgecolor="#ef4444" if is_severe else "#cbd5e1", alpha=0.8, linewidth=0.6)
        )

    # Legend for symbols
    acc_handles = [
        Line2D([0], [0], marker="P", color='w', markerfacecolor="#059669", markeredgecolor='w', markersize=9, label="Authorized Collection Facility"),
        Line2D([0], [0], color='#10b981', lw=1.5, linestyle="--", label="1 km Walkable Service Boundary"),
        mpatches.Patch(facecolor="#fef2f2", edgecolor="#ef4444", label="Severe Accessibility Gap (>70% Unserved Area)")
    ]
    ax.legend(handles=acc_handles, title="Accessibility Indicators", loc="upper left", framealpha=0.95, fontsize=8, title_fontsize=9)

    ax.set_title("MAP 7: FORMAL FACILITY ACCESSIBILITY DEFICIT\nProximity Deficit and Ward Spatial Coverage Gaps", fontsize=13, fontweight='bold', pad=14, color="#0f172a")
    add_cartographic_elements(ax)

    m7_path = os.path.join(MAPS_DIR, "facility_accessibility", "map7_facility_accessibility_deficit.png")
    plt.tight_layout()
    plt.savefig(m7_path, dpi=300, facecolor=fig.get_facecolor(), bbox_inches='tight')
    plt.close()
    print(f"Saved: {m7_path}")

    # -------------------------------------------------------------
    # MAP 8: Main Result - Final E-Waste Hotspot Risk Map
    # -------------------------------------------------------------
    print("Generating Map 8: Final E-Waste Hotspot Risk Map (Main Result)...")
    fig, ax = plt.subplots(figsize=(10, 12), dpi=300)
    fig.patch.set_facecolor('#ffffff')
    ax.set_facecolor('#f8fafc')

    # Color scheme for 5 risk categories
    tier_colors = {
        "Very Low": "#22c55e",    # Green
        "Low": "#84cc16",         # Light Green
        "Moderate": "#facc15",    # Amber Yellow
        "High": "#f97316",        # Orange
        "Very High": "#ef4444"     # Red
    }
    wards_gdf["tier_color"] = wards_gdf["Risk_Category"].map(tier_colors)

    wards_gdf.plot(
        ax=ax,
        color=wards_gdf["tier_color"],
        edgecolor="#1e293b",
        linewidth=1.2,
        zorder=2
    )

    # Highlight and label Top 5 Hotspots with Callouts
    top5 = wards_gdf.sort_values(by="EHI", ascending=False).head(5)
    for rank, (_, row) in enumerate(top5.iterrows(), 1):
        cent = row.geometry.centroid
        ax.annotate(
            f"#{rank} {row['ward_name'].split('(')[0].strip()}\nEHI: {row['EHI']:.3f} ({row['Risk_Category']})",
            xy=(cent.x, cent.y),
            xytext=(cent.x + 2200, cent.y + 1800),
            fontsize=7.5, fontweight='bold', color="#7f1d1d",
            arrowprops=dict(arrowstyle="->", color="#991b1b", lw=1.3),
            bbox=dict(boxstyle="round,pad=0.3", facecolor="#fee2e2", edgecolor="#b91c1c", alpha=0.95),
            zorder=6
        )

    # Ward Labels on polygons
    for _, row in wards_gdf.iterrows():
        cent = row.geometry.centroid
        ax.text(
            cent.x, cent.y, f"{row['name']}\n{row['EHI']:.3f}",
            fontsize=7.2, fontweight='bold', color="#0f172a",
            ha="center", va="center",
            bbox=dict(boxstyle="circle,pad=0.18", facecolor="white", edgecolor="#475569", alpha=0.82, linewidth=0.6),
            zorder=4
        )

    # Formal Facilities Points overlay
    facilities_gdf.plot(ax=ax, color="#1e1b4b", edgecolor="#ffffff", linewidth=1.2, markersize=50, marker="P", zorder=5)

    # Custom 5-tier Legend
    tier_handles = [
        mpatches.Patch(facecolor="#ef4444", edgecolor="#1e293b", label=f"Very High Risk (0.80 - 1.00) [n={len(wards_gdf[wards_gdf['Risk_Category']=='Very High'])}]"),
        mpatches.Patch(facecolor="#f97316", edgecolor="#1e293b", label=f"High Risk (0.60 - 0.80) [n={len(wards_gdf[wards_gdf['Risk_Category']=='High'])}]"),
        mpatches.Patch(facecolor="#facc15", edgecolor="#1e293b", label=f"Moderate Risk (0.40 - 0.60) [n={len(wards_gdf[wards_gdf['Risk_Category']=='Moderate'])}]"),
        mpatches.Patch(facecolor="#84cc16", edgecolor="#1e293b", label=f"Low Risk (0.20 - 0.40) [n={len(wards_gdf[wards_gdf['Risk_Category']=='Low'])}]"),
        mpatches.Patch(facecolor="#22c55e", edgecolor="#1e293b", label=f"Very Low Risk (0.00 - 0.20) [n={len(wards_gdf[wards_gdf['Risk_Category']=='Very Low'])}]"),
        Line2D([0], [0], marker="P", color='w', markerfacecolor="#1e1b4b", markeredgecolor='w', markersize=8, label="Formal Collection / Recycling Facility")
    ]
    ax.legend(handles=tier_handles, title="E-Waste Hotspot Index (EHI) Classification\nEHI = 0.30G + 0.25P + 0.20C + 0.15D + 0.10A", loc="upper left", framealpha=0.96, fontsize=7.5, title_fontsize=8.5)

    ax.set_title("MAP 8: FINAL E-WASTE HOTSPOT RISK MAP (MAIN RESULT)\nMulti-Criteria Identification of Priority Intervention Zones in Greater Mumbai", fontsize=12.5, fontweight='bold', pad=14, color="#0f172a")
    add_cartographic_elements(ax)

    m8_path = os.path.join(MAPS_DIR, "hotspot_map", "map8_final_ewaste_hotspot_risk.png")
    plt.tight_layout()
    plt.savefig(m8_path, dpi=300, facecolor=fig.get_facecolor(), bbox_inches='tight')
    plt.close()
    print(f"Saved: {m8_path}")

    print("\nAll 8 Maps successfully rendered at 300 DPI!")

if __name__ == "__main__":
    main()
