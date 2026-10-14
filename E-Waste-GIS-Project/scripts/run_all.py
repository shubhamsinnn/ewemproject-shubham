"""
run_all.py
----------
Master reproduction pipeline for the E-Waste GIS Project.
Executes all data processing, spatial modeling, cartographic map generation,
statistical chart generation, QGIS project assembly, and dashboard generation.
"""

import sys
import subprocess
import os

SCRIPTS = [
    ("01_prepare_study_area.py", "Preparing Study Area & Administrative Ward Boundaries"),
    ("02_generate_spatial_datasets.py", "Generating Spatial Point Datasets and Primary Survey"),
    ("03_run_spatial_analysis.py", "Running Buffer, Proximity, KDE, and Ward Spatial Analysis"),
    ("04_calculate_ehi_hotspots.py", "Calculating E-Waste Hotspot Index (EHI) & Sensitivity Analysis"),
    ("05_generate_publication_maps.py", "Rendering All 8 Publication-Grade Cartographic Maps (300 DPI)"),
    ("06_generate_charts_and_stats.py", "Rendering High-Resolution Statistical Charts & Figures"),
    ("07_build_interactive_dashboard.py", "Building Interactive WebGIS Decision Support Dashboard"),
    ("08_generate_qgis_project_and_styles.py", "Generating QGIS 3.x Project File & Layer Styles")
]

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    scripts_dir = os.path.join(base_dir, "scripts")
    python_exe = sys.executable

    print("=" * 75)
    print("GIS-BASED MULTI-CRITERIA ANALYSIS FOR IDENTIFICATION OF E-WASTE HOTSPOTS")
    print("Study Area: Mumbai (MCGM / BMC) | 24 Administrative Wards")
    print("=" * 75)

    for script_name, desc in SCRIPTS:
        script_path = os.path.join(scripts_dir, script_name)
        print(f"\n[PIPELINE STEP] Running {script_name}...")
        print(f"Description: {desc}")
        res = subprocess.run([python_exe, script_path], cwd=base_dir, capture_output=True, text=True)
        if res.returncode != 0:
            print(f"ERROR executing {script_name}:\n{res.stderr}")
            sys.exit(1)
        else:
            print(f"SUCCESS: {script_name} completed cleanly.")

    print("\n" + "=" * 75)
    print("ALL PIPELINE STAGES COMPLETED SUCCESSFULLY!")
    print("Outputs generated:")
    print(" - Maps (8 High-Res PNGs): maps/*")
    print(" - Charts (7 Figures): charts/*")
    print(" - Processed Spatial Data: data/processed/*")
    print(" - Survey Dataset & Codebook: survey/* & data/sample/*")
    print(" - QGIS Project & Styles: gis/qgis_project/* & gis/styles/*")
    print(" - WebGIS Dashboard: dashboard/index.html")
    print("=" * 75)

if __name__ == "__main__":
    main()
