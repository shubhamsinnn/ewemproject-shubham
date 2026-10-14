"""
04_calculate_ehi_hotspots.py
----------------------------
Implements the Multi-Criteria Evaluation (MCE) for the E-Waste Hotspot Index (EHI):
EHI = 0.30*G + 0.25*P + 0.20*C + 0.15*D + 0.10*A

Where:
- G = Normalized E-Waste Generation
- P = Normalized Population Density
- C = Normalized Commercial/Industrial Activity
- D = Normalized Disposal / Informal Dumping Risk
- A = Normalized Accessibility Deficit (Distance & Buffer Service Gap)

Performs Min-Max Normalization, 5-tier Risk Classification (Very Low to Very High),
Fisher-Jenks Natural Breaks comparison, Multi-Model Sensitivity Analysis,
and identifies the Top Hotspot Wards.
"""

import os
import numpy as np
import pandas as pd
import geopandas as gpd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")
LAYERS_DIR = os.path.join(BASE_DIR, "gis", "layers")

def min_max_normalize(series):
    """Applies standard linear Min-Max normalization to [0, 1] range."""
    s_min = series.min()
    s_max = series.max()
    if s_max == s_min:
        return series * 0.0
    return (series - s_min) / (s_max - s_min)

def classify_ehi_fixed(val):
    """Standard academic 5-tier classification."""
    if val < 0.20:
        return "Very Low"
    elif val < 0.40:
        return "Low"
    elif val < 0.60:
        return "Moderate"
    elif val < 0.80:
        return "High"
    else:
        return "Very High"

def main():
    print("--- Calculating E-Waste Hotspot Index (EHI) & Multi-Criteria Ranking ---")
    wards_path = os.path.join(PROCESSED_DIR, "mumbai_wards_enriched.geojson")
    gdf = gpd.read_file(wards_path)
    print(f"Loaded {len(gdf)} analyzed wards.")

    # 1. DEFINE MULTI-CRITERIA VARIABLES
    # G: Combined E-Waste Generation (Ward monthly baseline + Point Source estimated volume)
    gdf["raw_G"] = gdf["est_monthly_ewaste_kg"] + gdf["total_source_ewaste_kg"]

    # P: Population Density (persons per sq km)
    gdf["raw_P"] = gdf["pop_density_sqkm"]

    # C: Commercial & Industrial Activity Index (60% Commercial + 40% Industrial)
    gdf["raw_C"] = (gdf["commercial_index"] * 0.60) + (gdf["industrial_index"] * 0.40)

    # D: Disposal / Informal Dumping Risk:
    # High-risk scrap presence + informal hub penalties (Wards G/N Dharavi, L Kurla, M/E Govandi, C Chor Bazaar)
    informal_boost = gdf["name"].map({
        "G/N": 0.45, "L": 0.45, "M/E": 0.40, "C": 0.35, "D": 0.25, "K/E": 0.30
    }).fillna(0.0)
    gdf["raw_D"] = (gdf["high_risk_sources"] * 1.5) + (gdf["industrial_index"] * 2.0) + informal_boost

    # A: Accessibility Deficit (higher distance & higher % unserved area = higher deficit risk)
    gdf["raw_A"] = (gdf["dist_to_col_km"] * 0.6) + ((gdf["unserved_area_1km_pct"] / 100.0) * 4.0)

    # 2. MIN-MAX NORMALIZATION (0.0 to 1.0)
    gdf["norm_G"] = min_max_normalize(gdf["raw_G"])
    gdf["norm_P"] = min_max_normalize(gdf["raw_P"])
    gdf["norm_C"] = min_max_normalize(gdf["raw_C"])
    gdf["norm_D"] = min_max_normalize(gdf["raw_D"])
    gdf["norm_A"] = min_max_normalize(gdf["raw_A"])

    # 3. BASELINE EHI CALCULATION (Model 1)
    # EHI = 0.30*G + 0.25*P + 0.20*C + 0.15*D + 0.10*A
    gdf["EHI"] = (
        0.30 * gdf["norm_G"] +
        0.25 * gdf["norm_P"] +
        0.20 * gdf["norm_C"] +
        0.15 * gdf["norm_D"] +
        0.10 * gdf["norm_A"]
    ).round(4)

    # Risk Tier Assignment
    gdf["Risk_Category"] = gdf["EHI"].apply(classify_ehi_fixed)
    risk_order = {"Very Low": 1, "Low": 2, "Moderate": 3, "High": 4, "Very High": 5}
    gdf["Risk_Rank"] = gdf["Risk_Category"].map(risk_order)

    # 4. SENSITIVITY ANALYSIS (Alternative Weighting Models)
    # Model 2: Informal Vulnerability & Disposal Heavy (0.25G + 0.15P + 0.20C + 0.25D + 0.15A)
    gdf["EHI_Model2_InformalVulnerability"] = (
        0.25 * gdf["norm_G"] + 0.15 * gdf["norm_P"] + 0.20 * gdf["norm_C"] + 0.25 * gdf["norm_D"] + 0.15 * gdf["norm_A"]
    ).round(4)

    # Model 3: Consumption & Generation Heavy (0.40G + 0.30P + 0.15C + 0.10D + 0.05A)
    gdf["EHI_Model3_ConsumptionVolume"] = (
        0.40 * gdf["norm_G"] + 0.30 * gdf["norm_P"] + 0.15 * gdf["norm_C"] + 0.10 * gdf["norm_D"] + 0.05 * gdf["norm_A"]
    ).round(4)

    # Model 4: Equal Weights Unbiased (0.20G + 0.20P + 0.20C + 0.20D + 0.20A)
    gdf["EHI_Model4_EqualWeights"] = (
        0.20 * gdf["norm_G"] + 0.20 * gdf["norm_P"] + 0.20 * gdf["norm_C"] + 0.20 * gdf["norm_D"] + 0.20 * gdf["norm_A"]
    ).round(4)

    # Compute Rank for each model
    gdf["Rank_Baseline"] = gdf["EHI"].rank(ascending=False, method="min").astype(int)
    gdf["Rank_Model2"] = gdf["EHI_Model2_InformalVulnerability"].rank(ascending=False, method="min").astype(int)
    gdf["Rank_Model3"] = gdf["EHI_Model3_ConsumptionVolume"].rank(ascending=False, method="min").astype(int)
    gdf["Rank_Model4"] = gdf["EHI_Model4_EqualWeights"].rank(ascending=False, method="min").astype(int)

    # Spearman Rank Correlation across Models
    corr_m1_m2 = gdf["Rank_Baseline"].corr(gdf["Rank_Model2"], method="spearman")
    corr_m1_m3 = gdf["Rank_Baseline"].corr(gdf["Rank_Model3"], method="spearman")
    corr_m1_m4 = gdf["Rank_Baseline"].corr(gdf["Rank_Model4"], method="spearman")

    print(f"\n--- Sensitivity Analysis Correlations ---")
    print(f"Rank Correlation (Baseline vs Model 2 - Informal Focused): {corr_m1_m2:.4f}")
    print(f"Rank Correlation (Baseline vs Model 3 - Volume Focused):   {corr_m1_m3:.4f}")
    print(f"Rank Correlation (Baseline vs Model 4 - Equal Weights):    {corr_m1_m4:.4f}")

    # Sort by Baseline EHI descending
    gdf = gdf.sort_values(by="EHI", ascending=False).reset_index(drop=True)

    # Export Top 10 Hotspots Table per Section 11 specifications
    top10_cols = [
        "name", "ward_name", "zone", "EHI", "Risk_Category",
        "norm_G", "norm_P", "norm_C", "norm_D", "norm_A",
        "population", "pop_density_sqkm", "est_monthly_ewaste_kg",
        "dist_to_col_km", "unserved_area_1km_pct"
    ]
    df_top10 = gdf.head(10)[top10_cols].copy()
    df_top10.rename(columns={
        "name": "Ward_ID",
        "ward_name": "Ward_Name",
        "zone": "Zone",
        "pop_density_sqkm": "Pop_Density_per_sqkm",
        "est_monthly_ewaste_kg": "Monthly_EWaste_kg",
        "dist_to_col_km": "Distance_to_Facility_km",
        "unserved_area_1km_pct": "Unserved_Area_Pct"
    }, inplace=True)
    top10_csv = os.path.join(PROCESSED_DIR, "top_10_hotspots.csv")
    df_top10.to_csv(top10_csv, index=False)
    print(f"\nExported Top 10 Hotspots Table: {top10_csv}")
    print("\n--- TOP 10 E-WASTE HOTSPOT WARDS IN MUMBAI ---")
    print(df_top10[["Ward_ID", "Ward_Name", "EHI", "Risk_Category", "Pop_Density_per_sqkm", "Monthly_EWaste_kg", "Distance_to_Facility_km"]])

    # Export Full Results CSV
    full_csv = os.path.join(PROCESSED_DIR, "mumbai_wards_ehi_results.csv")
    gdf.drop(columns="geometry").to_csv(full_csv, index=False)
    print(f"\nExported Full Ward EHI Results CSV: {full_csv}")

    # Export Sensitivity Table
    sens_cols = [
        "name", "ward_name", "EHI", "Rank_Baseline",
        "EHI_Model2_InformalVulnerability", "Rank_Model2",
        "EHI_Model3_ConsumptionVolume", "Rank_Model3",
        "EHI_Model4_EqualWeights", "Rank_Model4"
    ]
    sens_csv = os.path.join(PROCESSED_DIR, "ehi_sensitivity_analysis.csv")
    gdf[sens_cols].to_csv(sens_csv, index=False)

    # Export Layers for GIS & WebGIS
    gdf.to_file(os.path.join(PROCESSED_DIR, "mumbai_wards_ehi_results.geojson"), driver="GeoJSON")
    gdf.to_file(os.path.join(LAYERS_DIR, "mumbai_ewaste_hotspots.geojson"), driver="GeoJSON")
    
    # Save shapefile
    # Shapefile column name cleanups
    shp_export = gdf[[
        "name", "ward_name", "zone", "EHI", "Risk_Category",
        "norm_G", "norm_P", "norm_C", "norm_D", "norm_A",
        "pop_density_sqkm", "est_monthly_ewaste_kg", "dist_to_col_km", "geometry"
    ]].copy()
    shp_export.columns = [
        "Ward_ID", "Ward_Name", "Zone", "EHI", "Risk_Cat",
        "norm_G", "norm_P", "norm_C", "norm_D", "norm_A",
        "Pop_Dens", "EWaste_kg", "Dist_Fac", "geometry"
    ]
    shp_export.to_file(os.path.join(LAYERS_DIR, "mumbai_ewaste_hotspots.shp"))
    print(f"Exported Hotspots Shapefile to {os.path.join(LAYERS_DIR, 'mumbai_ewaste_hotspots.shp')}")

    # Distribution of Risk Categories
    print("\n--- Risk Category Breakdown across 24 Wards ---")
    print(gdf["Risk_Category"].value_counts())

if __name__ == "__main__":
    main()
