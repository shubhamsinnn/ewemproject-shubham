"""
06_generate_charts_and_stats.py
-------------------------------
Generates high-resolution academic charts and statistical figures:
- Figure 1: Breakdown of Potential E-Waste Sources & Volume Generation
- Figure 2: Multi-Criteria Composition of Top 10 Hotspot Wards (G, P, C, D, A)
- Figure 3: Correlation Scatter Plot (Population Density vs E-Waste Generation)
- Figure 4: Primary Survey Disposal Pathways (Informal vs Formal Flows)
- Figure 5: Regulatory Awareness vs Willingness to Adopt Formal Take-Back
- Figure 6: Sensitivity Analysis Model Comparison (Rank Stability)
- Figure 7: Spatial Buffer Coverage & Unserved Deficit Analysis across Wards
"""

import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['font.family'] = 'sans-serif'

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")
SAMPLE_DIR = os.path.join(BASE_DIR, "data", "sample")
CHARTS_DIR = os.path.join(BASE_DIR, "charts")

os.makedirs(CHARTS_DIR, exist_ok=True)

def main():
    print("--- Generating Statistical Figures and Charts ---")

    # Load datasets
    df_wards = pd.read_csv(os.path.join(PROCESSED_DIR, "mumbai_wards_ehi_results.csv"))
    df_sources = pd.read_csv(os.path.join(PROCESSED_DIR, "master_ewaste_spatial_dataset.csv"))
    df_survey = pd.read_csv(os.path.join(SAMPLE_DIR, "ewaste_field_survey_responses.csv"))
    df_sens = pd.read_csv(os.path.join(PROCESSED_DIR, "ehi_sensitivity_analysis.csv"))

    # -------------------------------------------------------------
    # Figure 1: Breakdown of E-Waste Sources & Volume
    # -------------------------------------------------------------
    print("Generating Figure 1: E-Waste Source Categories...")
    src_summary = df_sources.groupby("Location_Type").agg(
        Count=("ID", "count"),
        Total_kg=("Estimated_Monthly_EWaste_kg", "sum")
    ).sort_values(by="Total_kg", ascending=True)

    fig, ax1 = plt.subplots(figsize=(10, 6.5), dpi=300)
    fig.patch.set_facecolor('#ffffff')
    ax1.set_facecolor('#f8fafc')

    y_pos = np.arange(len(src_summary))
    bars = ax1.barh(y_pos, src_summary["Total_kg"] / 1000.0, color="#3b82f6", edgecolor="#1d4ed8", alpha=0.85, height=0.65)

    ax1.set_yticks(y_pos)
    ax1.set_yticklabels(src_summary.index, fontsize=8.5, color="#1e293b")
    ax1.set_xlabel("Estimated Monthly E-Waste Generation (Metric Tons)", fontsize=10, fontweight='bold', color="#1e293b", labelpad=8)
    ax1.grid(axis='x', linestyle='--', alpha=0.5)

    # Value labels
    for bar in bars:
        width = bar.get_width()
        ax1.text(width + 0.5, bar.get_y() + bar.get_height()/2, f"{width:.1f} T",
                 va='center', ha='left', fontsize=8, color="#0f172a", fontweight='bold')

    ax1.set_title("FIGURE 1: POTENTIAL E-WASTE SOURCE CATEGORIES AND ESTIMATED GENERATION\nGreater Mumbai Point Source Registry (n=128 Locations)",
                  fontsize=11.5, fontweight='bold', pad=12, color="#0f172a")

    plt.tight_layout()
    f1_path = os.path.join(CHARTS_DIR, "chart1_source_distribution_by_type.png")
    plt.savefig(f1_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Saved: {f1_path}")

    # -------------------------------------------------------------
    # Figure 2: Stacked Multi-Criteria Components for Top 10 Wards
    # -------------------------------------------------------------
    print("Generating Figure 2: Top 10 Hotspots Multi-Criteria Breakdown...")
    top10 = df_wards.sort_values(by="EHI", ascending=False).head(10).copy()
    top10["label"] = top10["name"] + " (" + top10["ward_name"].apply(lambda x: x.split("(")[1].split("-")[0].strip()) + ")"

    # Weighted components: 0.30G, 0.25P, 0.20C, 0.15D, 0.10A
    top10["comp_G"] = top10["norm_G"] * 0.30
    top10["comp_P"] = top10["norm_P"] * 0.25
    top10["comp_C"] = top10["norm_C"] * 0.20
    top10["comp_D"] = top10["norm_D"] * 0.15
    top10["comp_A"] = top10["norm_A"] * 0.10

    fig, ax = plt.subplots(figsize=(11, 6.5), dpi=300)
    fig.patch.set_facecolor('#ffffff')
    ax.set_facecolor('#f8fafc')

    x = np.arange(len(top10))
    width = 0.58

    p1 = ax.bar(x, top10["comp_G"], width, label="0.30 * Generation (G)", color="#8b5cf6")
    p2 = ax.bar(x, top10["comp_P"], width, bottom=top10["comp_G"], label="0.25 * Pop Density (P)", color="#ec4899")
    p3 = ax.bar(x, top10["comp_C"], width, bottom=top10["comp_G"]+top10["comp_P"], label="0.20 * Commercial Activity (C)", color="#3b82f6")
    p4 = ax.bar(x, top10["comp_D"], width, bottom=top10["comp_G"]+top10["comp_P"]+top10["comp_C"], label="0.15 * Disposal/Dumping Risk (D)", color="#ef4444")
    p5 = ax.bar(x, top10["comp_A"], width, bottom=top10["comp_G"]+top10["comp_P"]+top10["comp_C"]+top10["comp_D"], label="0.10 * Accessibility Deficit (A)", color="#10b981")

    # Labels for total EHI
    for i, ehi_val in enumerate(top10["EHI"]):
        ax.text(i, ehi_val + 0.015, f"{ehi_val:.3f}", ha='center', va='bottom', fontsize=8.5, fontweight='bold', color="#0f172a")

    ax.set_xticks(x)
    ax.set_xticklabels(top10["label"], rotation=28, ha='right', fontsize=8.5, fontweight='bold', color="#1e293b")
    ax.set_ylabel("E-Waste Hotspot Index (EHI Score)", fontsize=10, fontweight='bold', color="#1e293b")
    ax.set_ylim(0, 0.95)
    ax.grid(axis='y', linestyle='--', alpha=0.5)
    ax.legend(loc="upper right", framealpha=0.95, fontsize=8.5)

    ax.set_title("FIGURE 2: MULTI-CRITERIA COMPONENT DECOMPOSITION OF TOP 10 HOTSPOT WARDS\nEHI = 0.30G + 0.25P + 0.20C + 0.15D + 0.10A",
                 fontsize=11.5, fontweight='bold', pad=12, color="#0f172a")

    plt.tight_layout()
    f2_path = os.path.join(CHARTS_DIR, "chart2_top10_hotspot_wards_ehi.png")
    plt.savefig(f2_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Saved: {f2_path}")

    # -------------------------------------------------------------
    # Figure 3: Scatter Correlation (Pop Density vs E-Waste Gen)
    # -------------------------------------------------------------
    print("Generating Figure 3: Population Density vs E-Waste Scatter...")
    fig, ax = plt.subplots(figsize=(9, 6), dpi=300)
    fig.patch.set_facecolor('#ffffff')
    ax.set_facecolor('#f8fafc')

    tier_palette = {"Very High": "#ef4444", "High": "#f97316", "Moderate": "#facc15", "Low": "#84cc16", "Very Low": "#22c55e"}

    sns.scatterplot(
        data=df_wards,
        x=df_wards["pop_density_sqkm"] / 1000.0,
        y="est_monthly_ewaste_tons",
        hue="Risk_Category",
        palette=tier_palette,
        s=120,
        edgecolor="#1e293b",
        linewidth=0.8,
        ax=ax,
        zorder=3
    )

    # Regression Trendline
    x_val = df_wards["pop_density_sqkm"] / 1000.0
    y_val = df_wards["est_monthly_ewaste_tons"]
    m, b = np.polyfit(x_val, y_val, 1)
    ax.plot(x_val, m*x_val + b, color="#64748b", linestyle="--", linewidth=1.5, label=f"Linear Fit (R² = {np.corrcoef(x_val, y_val)[0,1]**2:.2f})")

    # Annotate Top Wards
    for _, row in df_wards[df_wards["Risk_Category"].isin(["High", "Very High"])].iterrows():
        ax.annotate(
            row["name"],
            xy=(row["pop_density_sqkm"]/1000.0, row["est_monthly_ewaste_tons"]),
            xytext=(row["pop_density_sqkm"]/1000.0 + 1.2, row["est_monthly_ewaste_tons"] + 10),
            fontsize=8, fontweight='bold', color="#0f172a"
        )

    ax.set_xlabel("Population Density ('000 Persons / sq km)", fontsize=10, fontweight='bold', color="#1e293b")
    ax.set_ylabel("Estimated E-Waste Generation (Metric Tons / Month)", fontsize=10, fontweight='bold', color="#1e293b")
    ax.grid(True, linestyle='--', alpha=0.5)
    ax.legend(title="Hotspot Risk Category", loc="upper left", framealpha=0.95, fontsize=8.5)

    ax.set_title("FIGURE 3: CORRELATION BETWEEN POPULATION DENSITY AND ESTIMATED E-WASTE\nStratified by Ward E-Waste Hotspot Index Risk Tier",
                 fontsize=11.5, fontweight='bold', pad=12, color="#0f172a")

    plt.tight_layout()
    f3_path = os.path.join(CHARTS_DIR, "chart3_correlation_population_vs_ewaste.png")
    plt.savefig(f3_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Saved: {f3_path}")

    # -------------------------------------------------------------
    # Figure 4: Primary Survey Disposal Pathways
    # -------------------------------------------------------------
    print("Generating Figure 4: Survey Disposal Pathways...")
    disp_counts = df_survey["Primary_Disposal_Method"].value_counts()

    fig, ax = plt.subplots(figsize=(9, 6), dpi=300)
    fig.patch.set_facecolor('#ffffff')
    ax.set_facecolor('#f8fafc')

    # Color informal vs formal
    colors = []
    for method in disp_counts.index:
        if "Authorized" in method or "Formal" in method or "Return to Brand" in method:
            colors.append("#10b981")  # Formal Green
        elif "Cupboards" in method or "Drawers" in method or "Warehouse" in method:
            colors.append("#f59e0b")  # Hoarded Amber
        elif "Garbage" in method:
            colors.append("#ef4444")  # Municipal Waste Red
        else:
            colors.append("#6366f1")  # Informal Scrap Violet

    y_pos = np.arange(len(disp_counts))
    bars = ax.barh(y_pos, disp_counts.values, color=colors, edgecolor="#1e293b", alpha=0.88, height=0.6)

    ax.set_yticks(y_pos)
    ax.set_yticklabels(disp_counts.index, fontsize=8.5, color="#1e293b")
    ax.set_xlabel("Number of Survey Respondents (Total n=80)", fontsize=10, fontweight='bold', color="#1e293b")
    ax.grid(axis='x', linestyle='--', alpha=0.5)

    for bar in bars:
        width = bar.get_width()
        pct = (width / len(df_survey)) * 100
        ax.text(width + 0.3, bar.get_y() + bar.get_height()/2, f"{int(width)} ({pct:.1f}%)",
                va='center', ha='left', fontsize=8, color="#0f172a", fontweight='bold')

    # Legend for flow types
    patches = [
        plt.Rectangle((0,0),1,1, color="#10b981", label="Formal Channel / OEM Reverse Logistics"),
        plt.Rectangle((0,0),1,1, color="#6366f1", label="Informal Scrap / Secondary Market"),
        plt.Rectangle((0,0),1,1, color="#f59e0b", label="Hoarded in Homes / Storage"),
        plt.Rectangle((0,0),1,1, color="#ef4444", label="Mixed with Domestic Municipal Waste")
    ]
    ax.legend(handles=patches, loc="lower right", framealpha=0.95, fontsize=8)

    ax.set_title("FIGURE 4: PRIMARY E-WASTE DISPOSAL PATHWAYS (FIELD SURVEY RESULTS)\nEmpirical Distribution across 80 Survey Respondents in Mumbai",
                 fontsize=11.5, fontweight='bold', pad=12, color="#0f172a")

    plt.tight_layout()
    f4_path = os.path.join(CHARTS_DIR, "chart4_survey_disposal_behavior.png")
    plt.savefig(f4_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Saved: {f4_path}")

    # -------------------------------------------------------------
    # Figure 5: Awareness vs Distance / Willingness
    # -------------------------------------------------------------
    print("Generating Figure 5: Regulatory Awareness & Willingness...")
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5), dpi=300)
    fig.patch.set_facecolor('#ffffff')

    # Pie 1: Awareness
    aw_counts = df_survey["Awareness_of_EWaste_Rules"].value_counts()
    ax1.pie(aw_counts.values, labels=aw_counts.index, autopct='%1.1f%%', startangle=140,
            colors=["#ef4444", "#f59e0b", "#10b981"], wedgeprops=dict(edgecolor="#1e293b", linewidth=1.1))
    ax1.set_title("Awareness of E-Waste\nManagement Rules 2022", fontsize=10.5, fontweight='bold')

    # Bar 2: Distance distribution by respondent category
    sns.boxplot(data=df_survey, x="Respondent_Category", y="Distance_to_Nearest_Formal_Facility_km",
                palette="Blues", ax=ax2, boxprops=dict(edgecolor="#1e293b", linewidth=0.9))
    ax2.set_xticklabels(ax2.get_xticklabels(), rotation=25, ha='right', fontsize=8)
    ax2.set_xlabel("")
    ax2.set_ylabel("Distance to Nearest Formal Centre (km)", fontsize=9, fontweight='bold')
    ax2.grid(axis='y', linestyle='--', alpha=0.5)
    ax2.set_title("Reported Distance to Nearest Formal Centre\nby Respondent Category", fontsize=10.5, fontweight='bold')

    fig.suptitle("FIGURE 5: COMMUNITY AWARENESS DEFICIT AND DISTANCE BARRIERS TO FORMAL RECYCLING", fontsize=11.5, fontweight='bold', y=1.02)
    plt.tight_layout()
    f5_path = os.path.join(CHARTS_DIR, "chart5_survey_awareness_vs_willingness.png")
    plt.savefig(f5_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Saved: {f5_path}")

    # -------------------------------------------------------------
    # Figure 6: Sensitivity Analysis Model Comparison
    # -------------------------------------------------------------
    print("Generating Figure 6: Sensitivity Analysis Comparison...")
    fig, ax = plt.subplots(figsize=(10, 6.5), dpi=300)
    fig.patch.set_facecolor('#ffffff')
    ax.set_facecolor('#f8fafc')

    # Plot top 12 wards rank comparison across models
    top12_wards = df_sens.sort_values(by="Rank_Baseline").head(12)
    x = np.arange(len(top12_wards))

    ax.plot(x, top12_wards["Rank_Baseline"], marker='o', linewidth=2.5, color="#1e293b", label="Baseline Model 1 (0.30G, 0.25P, 0.20C, 0.15D, 0.10A)")
    ax.plot(x, top12_wards["Rank_Model2"], marker='s', linewidth=1.8, linestyle='--', color="#ef4444", label="Model 2: Informal Vulnerability Heavy (0.25D, 0.15A)")
    ax.plot(x, top12_wards["Rank_Model3"], marker='^', linewidth=1.8, linestyle=':', color="#8b5cf6", label="Model 3: Volume & Pop Heavy (0.40G, 0.30P)")
    ax.plot(x, top12_wards["Rank_Model4"], marker='D', linewidth=1.5, linestyle='-.', color="#10b981", label="Model 4: Equal Weights (All 0.20)")

    ax.set_xticks(x)
    ax.set_xticklabels(top12_wards["name"], fontsize=9, fontweight='bold', color="#0f172a")
    ax.set_ylabel("Ward Hotspot Priority Rank (1 = Highest Risk)", fontsize=10, fontweight='bold', color="#1e293b")
    ax.set_xlabel("Municipal Ward ID", fontsize=10, fontweight='bold', color="#1e293b")
    ax.set_yticks(np.arange(1, 15))
    ax.invert_yaxis()  # Rank 1 at top
    ax.grid(True, linestyle='--', alpha=0.5)
    ax.legend(loc="lower left", framealpha=0.95, fontsize=8)

    ax.set_title("FIGURE 6: MULTI-CRITERIA SENSITIVITY ANALYSIS (RANK STABILITY)\nDemonstrating Consistent Hotspot Priority across 4 Weighting Schemes (Spearman r > 0.95)",
                 fontsize=11.5, fontweight='bold', pad=12, color="#0f172a")

    plt.tight_layout()
    f6_path = os.path.join(CHARTS_DIR, "chart6_sensitivity_analysis_weights.png")
    plt.savefig(f6_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Saved: {f6_path}")

    # -------------------------------------------------------------
    # Figure 7: Spatial Buffer Coverage & Unserved Deficit
    # -------------------------------------------------------------
    print("Generating Figure 7: Ward Buffer Coverage & Unserved Deficit...")
    sorted_unserved = df_wards.sort_values(by="unserved_area_1km_pct", ascending=True)

    fig, ax = plt.subplots(figsize=(10, 7), dpi=300)
    fig.patch.set_facecolor('#ffffff')
    ax.set_facecolor('#f8fafc')

    y_pos = np.arange(len(sorted_unserved))
    served_pct = 100.0 - sorted_unserved["unserved_area_1km_pct"]

    p_served = ax.barh(y_pos, served_pct, color="#10b981", edgecolor="#047857", height=0.6, label="Served within 1 km Buffer")
    p_unserved = ax.barh(y_pos, sorted_unserved["unserved_area_1km_pct"], left=served_pct, color="#f87171", edgecolor="#b91c1c", height=0.6, label="Unserved Spatial Deficit (>1 km)")

    ax.set_yticks(y_pos)
    ax.set_yticklabels(sorted_unserved["name"] + " (" + sorted_unserved["ward_name"].apply(lambda x: x.split('(')[1].split('-')[0].strip()) + ")", fontsize=8, color="#1e293b")
    ax.set_xlabel("Percentage of Municipal Ward Area (%)", fontsize=10, fontweight='bold', color="#1e293b")
    ax.set_xlim(0, 100)
    ax.grid(axis='x', linestyle='--', alpha=0.5)
    ax.legend(loc="lower right", framealpha=0.95, fontsize=8.5)

    ax.set_title("FIGURE 7: FORMAL SERVICE COVERAGE VS. ACCESSIBILITY DEFICIT ACROSS WARDS\n1 km Pedestrian Buffer Service Adequacy (MCGM Wards)",
                 fontsize=11.5, fontweight='bold', pad=12, color="#0f172a")

    plt.tight_layout()
    f7_path = os.path.join(CHARTS_DIR, "chart7_formal_vs_informal_flow.png")
    plt.savefig(f7_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Saved: {f7_path}")

    print("\nAll 7 statistical figures successfully rendered at 300 DPI!")

if __name__ == "__main__":
    main()
