"""
update_dashboard_script.py
Master runner and builder for the E-Waste GIS Real-Time Dashboard.
Rebuilds the interactive dashboard and opens it in the default web browser.
"""

import os
import sys
import subprocess
import webbrowser

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPTS_DIR = os.path.join(BASE_DIR, "scripts")
DASHBOARD_HTML = os.path.join(BASE_DIR, "dashboard", "index.html")

def main():
    print("=" * 70)
    print("MUMBAI E-WASTE GIS REAL-TIME COMMAND DASHBOARD")
    print("=" * 70)
    
    # 1. Rebuild the interactive dashboard
    builder_script = os.path.join(SCRIPTS_DIR, "07_build_interactive_dashboard.py")
    print(f"\n[1/2] Building standalone WebGIS dashboard via {os.path.basename(builder_script)}...")
    res = subprocess.run([sys.executable, builder_script], cwd=BASE_DIR, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Error rebuilding dashboard:\n{res.stderr}")
        return
    print("Dashboard built successfully!")
    print(res.stdout.strip())
    
    # 2. Launch in default web browser
    print(f"\n[2/2] Launching dashboard in browser: {DASHBOARD_HTML}")
    webbrowser.open(f"file:///{os.path.abspath(DASHBOARD_HTML).replace(os.sep, '/')}")
    print("Dashboard launched successfully!")
    print("=" * 70)

if __name__ == "__main__":
    main()
