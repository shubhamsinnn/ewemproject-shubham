"""
08_generate_qgis_project_and_styles.py
--------------------------------------
Generates a complete QGIS 3.x Project File (mumbai_ewaste_hotspots.qgs)
and standard QGIS layer style files (.qml) for seamless opening in QGIS.
Pre-configures:
- CRS: EPSG:32643 (UTM Zone 43N)
- Layer tree hierarchy: Hotspot Zones, Sources, Facilities, Service Buffers, KDE Surface
- Thematic symbology for all layers
"""

import os
import uuid

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QGIS_DIR = os.path.join(BASE_DIR, "gis", "qgis_project")
STYLES_DIR = os.path.join(BASE_DIR, "gis", "styles")
LAYERS_DIR = os.path.join(BASE_DIR, "gis", "layers")

os.makedirs(QGIS_DIR, exist_ok=True)
os.makedirs(STYLES_DIR, exist_ok=True)

HOTSPOT_QML = """<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis version="3.28.0" styleCategories="AllStyleCategories">
  <renderer-v2 type="categorizedSymbol" attr="Risk_Category">
    <categories>
      <category symbol="0" value="Very High" label="Very High Risk (0.80 - 1.00)" render="true"/>
      <category symbol="1" value="High" label="High Risk (0.60 - 0.80)" render="true"/>
      <category symbol="2" value="Moderate" label="Moderate Risk (0.40 - 0.60)" render="true"/>
      <category symbol="3" value="Low" label="Low Risk (0.20 - 0.40)" render="true"/>
      <category symbol="4" value="Very Low" label="Very Low Risk (0.00 - 0.20)" render="true"/>
    </categories>
    <symbols>
      <symbol type="fill" name="0" alpha="0.85"><layer pass="0" class="SimpleFill"><prop k="color" v="239,68,68,255"/><prop k="outline_color" v="30,41,59,255"/><prop k="outline_width" v="0.4"/></layer></symbol>
      <symbol type="fill" name="1" alpha="0.85"><layer pass="0" class="SimpleFill"><prop k="color" v="249,115,22,255"/><prop k="outline_color" v="30,41,59,255"/><prop k="outline_width" v="0.4"/></layer></symbol>
      <symbol type="fill" name="2" alpha="0.85"><layer pass="0" class="SimpleFill"><prop k="color" v="250,204,21,255"/><prop k="outline_color" v="30,41,59,255"/><prop k="outline_width" v="0.4"/></layer></symbol>
      <symbol type="fill" name="3" alpha="0.85"><layer pass="0" class="SimpleFill"><prop k="color" v="132,204,22,255"/><prop k="outline_color" v="30,41,59,255"/><prop k="outline_width" v="0.4"/></layer></symbol>
      <symbol type="fill" name="4" alpha="0.85"><layer pass="0" class="SimpleFill"><prop k="color" v="34,197,94,255"/><prop k="outline_color" v="30,41,59,255"/><prop k="outline_width" v="0.4"/></layer></symbol>
    </symbols>
  </renderer-v2>
</qgis>
"""

BUFFERS_QML = """<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis version="3.28.0" styleCategories="AllStyleCategories">
  <renderer-v2 type="singleSymbol">
    <symbol type="fill" name="0" alpha="0.45">
      <layer pass="0" class="SimpleFill">
        <prop k="color" v="99,102,241,110"/>
        <prop k="outline_color" v="67,56,202,255"/>
        <prop k="outline_style" v="dash"/>
        <prop k="outline_width" v="0.35"/>
      </layer>
    </symbol>
  </renderer-v2>
</qgis>
"""

SOURCES_QML = """<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis version="3.28.0" styleCategories="AllStyleCategories">
  <renderer-v2 type="categorizedSymbol" attr="Disposal_Risk">
    <categories>
      <category symbol="0" value="Very High" label="Very High Risk / Informal Dismantling" render="true"/>
      <category symbol="1" value="High" label="High Risk" render="true"/>
      <category symbol="2" value="Moderate" label="Moderate Risk" render="true"/>
      <category symbol="3" value="Low" label="Low Risk" render="true"/>
    </categories>
    <symbols>
      <symbol type="marker" name="0" alpha="0.9"><layer pass="0" class="SimpleMarker"><prop k="color" v="220,38,38,255"/><prop k="size" v="3.5"/><prop k="outline_color" v="0,0,0,255"/></layer></symbol>
      <symbol type="marker" name="1" alpha="0.9"><layer pass="0" class="SimpleMarker"><prop k="color" v="234,88,12,255"/><prop k="size" v="3.0"/><prop k="outline_color" v="0,0,0,255"/></layer></symbol>
      <symbol type="marker" name="2" alpha="0.9"><layer pass="0" class="SimpleMarker"><prop k="color" v="59,130,246,255"/><prop k="size" v="2.5"/><prop k="outline_color" v="0,0,0,255"/></layer></symbol>
      <symbol type="marker" name="3" alpha="0.9"><layer pass="0" class="SimpleMarker"><prop k="color" v="16,185,129,255"/><prop k="size" v="2.2"/><prop k="outline_color" v="0,0,0,255"/></layer></symbol>
    </symbols>
  </renderer-v2>
</qgis>
"""

FACILITIES_QML = """<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis version="3.28.0" styleCategories="AllStyleCategories">
  <renderer-v2 type="singleSymbol">
    <symbol type="marker" name="0" alpha="1.0">
      <layer pass="0" class="SimpleMarker">
        <prop k="name" v="cross"/>
        <prop k="color" v="30,27,75,255"/>
        <prop k="size" v="4.2"/>
        <prop k="outline_color" v="255,255,255,255"/>
        <prop k="outline_width" v="0.6"/>
      </layer>
    </symbol>
  </renderer-v2>
</qgis>
"""

def generate_qgs_project():
    """Generates a complete QGIS project XML file."""
    qgs_content = f"""<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis projectname="GIS-Based Multi-Criteria Identification of E-Waste Hotspots (Mumbai)" version="3.28.0-Firenze">
  <homePath path=""/>
  <title>GIS-Based Multi-Criteria Analysis for Identification of E-Waste Hotspots in Greater Mumbai</title>
  <autotransaction active="0"/>
  <evaluateDefaultValues active="0"/>
  <trust active="0"/>
  <projectCrs>
    <spatialrefsys nativeFormat="Wkt">
      <wkt>PROJCRS["WGS 84 / UTM zone 43N",BASEGEOGCRS["WGS 84",DATUM["World Geodetic System 1984",ELLIPSOID["WGS 84",6378137,298.257223563,LENGTHUNIT["metre",1]]],PRIMEM["Greenwich",0,ANGLEUNIT["degree",0.0174532925199433]],ID["EPSG",4326]],CONVERSION["UTM zone 43N",METHOD["Transverse Mercator",ID["EPSG",9807]],PARAMETER["Latitude of natural origin",0,ANGLEUNIT["degree",0.0174532925199433],ID["EPSG",8801]],PARAMETER["Longitude of natural origin",75,ANGLEUNIT["degree",0.0174532925199433],ID["EPSG",8802]],PARAMETER["Scale factor at natural origin",0.9996,SCALEUNIT["unity",1],ID["EPSG",8805]],PARAMETER["False easting",500000,LENGTHUNIT["metre",1],ID["EPSG",8806]],PARAMETER["False northing",0,LENGTHUNIT["metre",1],ID["EPSG",8807]]],CS[Cartesian,2],AXIS["(E)",east,ORDER[1],LENGTHUNIT["metre",1]],AXIS["(N)",north,ORDER[2],LENGTHUNIT["metre",1]],USAGE[SCOPE["Engineering survey, topographic mapping."],AREA["Between 72°E and 78°E, northern hemisphere between equator and 84°N, onshore and offshore. India."],BBOX[0,72,84,78]],ID["EPSG",32643]]</wkt>
      <proj4>+proj=utm +zone=43 +datum=WGS84 +units=m +no_defs</proj4>
      <srsid>3127</srsid>
      <srid>32643</srid>
      <authid>EPSG:32643</authid>
      <description>WGS 84 / UTM zone 43N</description>
      <projectionacronym>utm</projectionacronym>
      <ellipsoidacronym>EPSG:7030</ellipsoidacronym>
      <geographicflag>false</geographicflag>
    </spatialrefsys>
  </projectCrs>
  <layer-tree-group>
    <customproperties/>
    <layer-tree-layer id="facilities_layer" name="Authorized E-Waste Facilities" source="../layers/ewaste_facilities_points.geojson" providerLib="ogr" checked="Qt::Checked"/>
    <layer-tree-layer id="sources_layer" name="Potential E-Waste Sources" source="../layers/ewaste_sources_points.geojson" providerLib="ogr" checked="Qt::Checked"/>
    <layer-tree-layer id="buffer_500m" name="Service Buffer 500m" source="../layers/facility_buffers_500m.geojson" providerLib="ogr" checked="Qt::Checked"/>
    <layer-tree-layer id="buffer_1km" name="Service Buffer 1km" source="../layers/facility_buffers_1km.geojson" providerLib="ogr" checked="Qt::Checked"/>
    <layer-tree-layer id="buffer_2km" name="Service Buffer 2km" source="../layers/facility_buffers_2km.geojson" providerLib="ogr" checked="Qt::Unchecked"/>
    <layer-tree-layer id="kde_density" name="Kernel Density Estimation Surface" source="../layers/ewaste_kde_density_grid.geojson" providerLib="ogr" checked="Qt::Unchecked"/>
    <layer-tree-layer id="hotspots_layer" name="E-Waste Hotspot Zones (EHI)" source="../layers/mumbai_ewaste_hotspots.geojson" providerLib="ogr" checked="Qt::Checked"/>
    <layer-tree-layer id="boundary_layer" name="Mumbai Study Area Boundary" source="../layers/mumbai_study_area_boundary.geojson" providerLib="ogr" checked="Qt::Checked"/>
  </layer-tree-group>
  <projectlayers>
    <maplayer type="vector" id="hotspots_layer" name="E-Waste Hotspot Zones (EHI)">
      <datasource>../layers/mumbai_ewaste_hotspots.geojson</datasource>
      <keywordList><value></value></keywordList>
      <layername>E-Waste Hotspot Zones (EHI)</layername>
      <srs>
        <spatialrefsys><authid>EPSG:4326</authid></spatialrefsys>
      </srs>
    </maplayer>
    <maplayer type="vector" id="sources_layer" name="Potential E-Waste Sources">
      <datasource>../layers/ewaste_sources_points.geojson</datasource>
      <layername>Potential E-Waste Sources</layername>
      <srs><spatialrefsys><authid>EPSG:4326</authid></spatialrefsys></srs>
    </maplayer>
    <maplayer type="vector" id="facilities_layer" name="Authorized E-Waste Facilities">
      <datasource>../layers/ewaste_facilities_points.geojson</datasource>
      <layername>Authorized E-Waste Facilities</layername>
      <srs><spatialrefsys><authid>EPSG:4326</authid></spatialrefsys></srs>
    </maplayer>
    <maplayer type="vector" id="buffer_500m" name="Service Buffer 500m">
      <datasource>../layers/facility_buffers_500m.geojson</datasource>
      <layername>Service Buffer 500m</layername>
      <srs><spatialrefsys><authid>EPSG:4326</authid></spatialrefsys></srs>
    </maplayer>
    <maplayer type="vector" id="buffer_1km" name="Service Buffer 1km">
      <datasource>../layers/facility_buffers_1km.geojson</datasource>
      <layername>Service Buffer 1km</layername>
      <srs><spatialrefsys><authid>EPSG:4326</authid></spatialrefsys></srs>
    </maplayer>
    <maplayer type="vector" id="kde_density" name="Kernel Density Estimation Surface">
      <datasource>../layers/ewaste_kde_density_grid.geojson</datasource>
      <layername>Kernel Density Estimation Surface</layername>
      <srs><spatialrefsys><authid>EPSG:4326</authid></spatialrefsys></srs>
    </maplayer>
    <maplayer type="vector" id="boundary_layer" name="Mumbai Study Area Boundary">
      <datasource>../layers/mumbai_study_area_boundary.geojson</datasource>
      <layername>Mumbai Study Area Boundary</layername>
      <srs><spatialrefsys><authid>EPSG:4326</authid></spatialrefsys></srs>
    </maplayer>
  </projectlayers>
</qgis>
"""
    return qgs_content

def main():
    print("--- Generating QGIS Project and Layer Styles ---")
    
    # Save QML Style Files
    with open(os.path.join(STYLES_DIR, "hotspots_risk_categorized.qml"), "w", encoding="utf-8") as f:
        f.write(HOTSPOT_QML)
    with open(os.path.join(STYLES_DIR, "facility_buffers.qml"), "w", encoding="utf-8") as f:
        f.write(BUFFERS_QML)
    with open(os.path.join(STYLES_DIR, "ewaste_sources_categorized.qml"), "w", encoding="utf-8") as f:
        f.write(SOURCES_QML)
    with open(os.path.join(STYLES_DIR, "facilities.qml"), "w", encoding="utf-8") as f:
        f.write(FACILITIES_QML)
    print("Saved QGIS QML style files in gis/styles/")

    # Save QGS Project File
    qgs_xml = generate_qgs_project()
    qgs_path = os.path.join(QGIS_DIR, "mumbai_ewaste_hotspots.qgs")
    with open(qgs_path, "w", encoding="utf-8") as f:
        f.write(qgs_xml)
    print(f"Saved QGIS Project File: {qgs_path}")

if __name__ == "__main__":
    main()
