# PRESENTATION SLIDES & SPEAKER NOTES
## GIS-Based Multi-Criteria Analysis for Identification of E-Waste Hotspots
### A Case Study of Greater Mumbai (MCGM / BMC)

---

## SLIDE 1: TITLE SLIDE
**Title:** GIS-Based Multi-Criteria Analysis for Identification of E-Waste Hotspots  
**Subtitle:** A Spatial Decision-Support Framework for Greater Mumbai  
**Course:** E-Waste Management & Environmental Spatial Informatics  
**Study Area:** 24 Municipal Wards, Municipal Corporation of Greater Mumbai (MCGM)  
**Presenter:** [Student Name / Project Team]  
**Academic Year:** 2026  

> **Speaker Notes:**  
> "Good morning, respected professors and panel members. Today, I am presenting our project titled 'GIS-Based Multi-Criteria Analysis for Identification of E-Waste Hotspots in Greater Mumbai.' This research develops a spatial model using QGIS, spatial statistics, and multi-criteria evaluation to pinpoint where electronic waste poses the greatest risk and where collection infrastructure is urgently needed."

---

## SLIDE 2: INTRODUCTION TO E-WASTE
- **Global Crisis:** E-waste reached 62 million metric tons in 2022; projected to hit 82 million tons by 2030 (UN Global E-Waste Monitor).
- **India's Status:** 3rd largest e-waste generator globally (>1.7 million metric tons/year).
- **Urban Epicenter:** Mumbai Metropolitan Region (MMR) is India's highest e-waste generating urban cluster (~110,000+ tons/year).
- **Toxicity vs. Resource Paradox:**
  - *Hazardous toxins:* Lead, mercury, cadmium, hexavalent chromium, brominated flame retardants.
  - *Valuable minerals:* Gold, silver, copper, platinum, palladium.
- **The Core Issue:** When discarded improperly, precious resources are lost while hazardous chemicals contaminate air, soil, and aquatic ecosystems.

> **Speaker Notes:**  
> "Electronic waste is the world's fastest-growing hazardous solid waste stream. Devices we use daily contain toxic heavy metals alongside valuable precious metals. In a hyper-dense coastal megacity like Mumbai, unmonitored e-waste accumulation creates grave public health and ecological hazards."

---

## SLIDE 3: PROBLEM STATEMENT
- **The Informal Sector Dominance:** Over 85%–90% of Mumbai's e-waste is channeled into informal scrap networks (kabadiwalas, unorganized dismantling sheds).
- **Crude Extraction Hazards:** Acid leaching of circuit boards and open burning of insulated copper wires release toxic dioxins, furans, and heavy metals.
- **Infrastructural Deficit:** Formal MPCB-registered collection centers and PRO take-back kiosks are sparse, inconvenient, and poorly publicized.
- **Lack of Spatial Intelligence:** Municipal solid waste planning treats e-waste uniformly without spatial awareness of intra-city hotspots, informal scrap corridors, or neighborhood accessibility gaps.

> **Speaker Notes:**  
> "The crux of the problem in Mumbai is not just how much e-waste is produced, but where it goes. Because formal drop points are inconvenient, the informal trade dominates. Without GIS mapping, authorities have no targeted visibility into which wards require urgent intervention."

---

## SLIDE 4: PROJECT OBJECTIVES
1. Identify and geocode 128+ potential e-waste point sources across Greater Mumbai.
2. Map authorized MPCB recycling facilities and analyze pedestrian/suburban service coverage buffers (500m, 1km, 2km).
3. Conduct an empirical field survey ($n = 80$) analyzing disposal behaviors and regulatory awareness.
4. Model continuous spatial point intensity using Kernel Density Estimation (KDE).
5. Develop a normalized multi-criteria **E-Waste Hotspot Index (EHI)**:
   $$\text{EHI} = 0.30G + 0.25P + 0.20C + 0.15D + 0.10A$$
6. Classify Mumbai's 24 administrative wards into 5 distinct risk tiers (Very Low to Very High).
7. Validate model stability through sensitivity analysis and formulate targeted spatial recommendations.

> **Speaker Notes:**  
> "Our objectives span the complete GIS project lifecycle: from geocoding point sources and running field surveys to multi-criteria indexing, spatial buffering, sensitivity analysis, and formulating actionable municipal policies."

---

## SLIDE 5: STUDY AREA PROFILE — GREATER MUMBAI
- **Administrative Framework:** 24 Municipal Administrative Wards (Wards A to T).
- **Geographic Extent:** $458.28\text{ km}^2$ on Salsette Island along the Arabian Sea.
- **Total Population:** 12,419,447 inhabitants (Census baseline with MCGM projections).
- **Extreme Density Gradient:**
  - South Mumbai commercial core: Ward C (Kalbadevi) = $93,348\text{ persons/km}^2$.
  - Informal cluster: Ward G/North (Dharavi) = $65,828\text{ persons/km}^2$.
  - Suburban periphery: Ward S (Powai/Bhandup) = $11,622\text{ persons/km}^2$.
- **Projected Coordinate System:** WGS 84 / UTM Zone 43N (EPSG: 32643) for planar meter precision.

> **Speaker Notes:**  
> "We selected Greater Mumbai divided into its 24 official administrative wards. We utilized UTM Zone 43N as our projected coordinate reference system to ensure that all distance, area, and buffer calculations are mathematically accurate in meters."

---

## SLIDE 6: DATA SOURCES & METHODOLOGICAL WORKFLOW
- **Multi-Tiered Spatial Data Model:**
  - *Secondary Official Data:* BMC Administrative Ward Boundaries (DataMeet), Census 2011/MCGM Population, MPCB Registered Facility Directory.
  - *Field Survey Calibration:* 80 structured interviews across households, tech offices, repair shops, and scrap dealers.
  - *Spatial Layer Engineering:* Point registries ($n = 128$), facility points ($n = 14$).
- **Integrated Analysis Pipeline:**
  1. UTM Reprojection $\rightarrow$ 2. Buffer Generation $\rightarrow$ 3. KD-Tree Nearest Neighbor $\rightarrow$ 4. KDE Surface $\rightarrow$ 5. Min-Max Normalization $\rightarrow$ 6. Multi-Criteria Indexing $\rightarrow$ 7. Sensitivity Testing.

> **Speaker Notes:**  
> "Our methodology integrates official government datasets with an empirical field survey and GIS processing. Data provenance is clearly maintained to distinguish empirical observations from calibrated sample demonstration models."

---

## SLIDE 7: PRIMARY FIELD SURVEY FINDINGS ($n = 80$)
- **Disposal Behavior Breakdown:**
  - **17.5% Domestic Hoarding:** Kept in cupboards, drawers, or storerooms indefinitely.
  - **27.5% Sold to Kabadiwalas:** Handed to doorstep scrap collectors for immediate cash.
  - **15.0% Secondary Dismantling:** Transferred to informal wholesale hubs (Kurla/Dharavi).
  - **19.9% Retail Exchange / Buyback:** Trade-ins via online or retail stores.
  - **Only 11.2% Formal Recyclers:** Primarily large corporate IT offices with mandatory EPR auditing.
  - **3.7% Mixed Municipal Waste:** Thrown directly into domestic garbage bins.
- **Regulatory Awareness:** $43.8\%$ completely unaware of India's E-Waste Management Rules; $36.2\%$ had heard of rules but had no knowledge of drop locations.
- **Key Barrier:** Average reported distance to an authorized drop point was $3.8\text{ km}$, creating a severe disincentive for voluntary compliance.

> **Speaker Notes:**  
> "The survey revealed striking realities: less than 12% of e-waste reaches authorized recyclers. The vast majority is either hoarded in homes or sold to kabadiwalas for cash. Over 80% of citizens have little to no actionable knowledge of e-waste drop centers."

---

## SLIDE 8: E-WASTE SOURCE DISTRIBUTION & INFRASTRUCTURE
- **Mapped Sources ($n = 128$):**
  - High-Volume Retail: Lamington Road (Ward D), Lohar Chawl (Ward C).
  - Corporate IT Parks: Mindspace Malad (Ward P/N), NESCO (Ward P/S), BKC (Ward H/E), Powai (Ward S).
  - Manufacturing SEZs: SEEPZ & MIDC Andheri East (Ward K/E).
  - Informal Scrap Hubs: Dharavi 13th Compound (Ward G/N), Kurla CST Road (Ward L), Govandi/Deonar (Ward M/E).
- **Formal Facilities ($n = 14$):**
  - Severe geographic mismatch: formal facilities are located primarily in upscale commercial complexes or distant peripheral industrial zones, leaving central and eastern suburban corridors underserved.

> **Speaker Notes:**  
> "Here on Map 2 and Map 3, we observe a major spatial contradiction. E-waste generation is heavily concentrated in commercial and residential corridors, but formal collection kiosks are scarce, creating massive geographic voids."

---

## SLIDE 9: ACCESSIBILITY & BUFFER ANALYSIS
- **Service Radii Evaluated:**
  - **500 m Buffer:** Immediate walkable pedestrian drop catchment.
  - **1 km Buffer:** Neighborhood accessibility zone.
  - **2 km Buffer:** Maximum suburban drop convenience boundary.
- **Spatial Coverage Deficit Findings:**
  - **Ward M/East (Govandi/Deonar):** $87.2\%$ of area outside 1km buffer; nearest facility is $5.62\text{ km}$ away.
  - **Ward S (Powai/Bhandup):** $77.8\%$ of land area unserved.
  - **Ward P/North (Malad):** $76.8\%$ unserved despite harboring 941,000 residents.
  - **Ward L (Kurla):** $42.8\%$ unserved despite housing major informal scrap corridors.

> **Speaker Notes:**  
> "Buffer analysis demonstrated that vast portions of Mumbai are complete 'service deserts.' In Ward M/East, over 87% of the ward is more than a kilometer away from any collection center. This physical distance directly drives residents to informal kabadiwalas."

---

## SLIDE 10: KERNEL DENSITY ESTIMATION (HEATMAP)
- **Continuous Density Modeling:**
  - Evaluated on a 500m grid using bivariate Gaussian KDE weighted by monthly generation volume.
- **Three Primary Intensity Cores Emerged:**
  1. **Core 1 (South Commercial Core):** Centered on Lamington Road, Chor Bazaar, and Lohar Chawl.
  2. **Core 2 (Western Industrial Tech Core):** Centered on Andheri East, SEEPZ, and Marol MIDC.
  3. **Core 3 (Central Informal Scrap Core):** Centered on the Kurla CST Road and Dharavi 13th Compound axis.

> **Speaker Notes:**  
> "Kernel Density Estimation moves beyond administrative boundaries to reveal continuous spatial clusters. As shown in Map 6, three prominent red hotspots dominate Mumbai: the South IT hardware core, the Andheri-SEEPZ industrial corridor, and the Kurla-Dharavi informal dismantling axis."

---

## SLIDE 11: E-WASTE HOTSPOT INDEX (EHI) FORMULATION
- **Multi-Criteria Linear Weighted Combination:**
  $$\text{EHI} = 0.30 G_{norm} + 0.25 P_{norm} + 0.20 C_{norm} + 0.15 D_{norm} + 0.10 A_{norm}$$
- **Components:**
  - **$G$ (Generation - 30%):** Total monthly e-waste mass flow (tons/month).
  - **$P$ (Population Density - 25%):** Concentration of human exposure and consumer discard frequency.
  - **$C$ (Commercial/Industrial Activity - 20%):** Presence of corporate IT offices, retail, and manufacturing.
  - **$D$ (Disposal / Dumping Risk - 15%):** Informal scrap clusters, burning evidence, and vulnerable dumping sites.
  - **$A$ (Accessibility Deficit - 10%):** Centroid distance and percentage of unserved buffer area.
- **Min-Max Feature Scaling:** Standardized all inputs to $[0.0, 1.0]$.

> **Speaker Notes:**  
> "To synthesize these diverse spatial layers, we developed the E-Waste Hotspot Index. Each factor was normalized between 0 and 1. Weights were assigned based on environmental risk principles: generation and population exposure carry over half the total weight, complemented by commercial intensity, informal risk, and accessibility deficits."

---

## SLIDE 12: FINAL E-WASTE HOTSPOT RISK MAP (MAIN RESULT)
- **Classification Distribution across 24 Wards:**
  - **High Risk (0.60 – 0.80):** 4 Wards (16.7%)
  - **Moderate Risk (0.40 – 0.60):** 8 Wards (33.3%)
  - **Low Risk (0.20 – 0.40):** 11 Wards (45.8%)
  - **Very Low Risk (0.00 – 0.20):** 1 Ward (4.2%)
- **Top 4 Critical Hotspots:**
  1. **Ward L (Kurla):** $\text{EHI} = 0.7719$
  2. **Ward K/East (Andheri East):** $\text{EHI} = 0.7516$
  3. **Ward G/North (Dharavi):** $\text{EHI} = 0.7248$
  4. **Ward M/East (Govandi/Deonar):** $\text{EHI} = 0.6385$

> **Speaker Notes:**  
> "This is Map 8, our primary research deliverable. The 24 wards are classified into risk tiers. Four wards emerge in the orange 'High Risk' category: Kurla, Andheri East, Dharavi, and Govandi/Deonar. These four wards represent the most critical targets for municipal intervention."

---

## SLIDE 13: SENSITIVITY ANALYSIS & MODEL VALIDATION
- **Evaluation Across 4 Distinct Weighting Models:**
  - Model 1: Baseline ($0.30G, 0.25P, 0.20C, 0.15D, 0.10A$)
  - Model 2: Informal Risk Focused ($0.25G, 0.15P, 0.20C, 0.25D, 0.15A$)
  - Model 3: Volume & Population Focused ($0.40G, 0.30P, 0.15C, 0.10D, 0.05A$)
  - Model 4: Equal Weights ($0.20$ each across all five criteria)
- **Spearman Rank Correlation ($r_s$):**
  - Baseline vs. Model 2: **$r_s = 0.9643$**
  - Baseline vs. Model 3: **$r_s = 0.9904$**
  - Baseline vs. Model 4: **$r_s = 0.9530$**
- **Conclusion:** Top priority ranks remained exceptionally stable across all perturbations, confirming scientific robustness and objectivity.

> **Speaker Notes:**  
> "To prove our index wasn't biased by subjective weights, we conducted sensitivity analysis against three alternative models. The Spearman rank correlation was above 0.95 in all cases, and the top four wards never changed ranks. This confirms our spatial prioritization is mathematically sound."

---

## SLIDE 14: LOCATION-SPECIFIC RECOMMENDATIONS
1. **Ward L (Kurla):** Establish an authorized e-waste aggregation cooperative on CST Road with formal buyback pricing to transition scrap dealers away from crude dismantling.
2. **Ward K/East (Andheri East):** Mandate corporate Extended Producer Responsibility (EPR) inventory auditing across SEEPZ and MIDC tech parks.
3. **Ward G/North (Dharavi):** Upgrade informal workshops into a regulated 'Green Dismantling Cluster' with mechanical shredders, dust extraction, and worker PPE.
4. **Ward M/East (Govandi/Deonar):** Deploy municipal mobile collection vans and enforce zero-burning monitoring around Deonar dumping perimeters.
5. **City-Wide Suburban Wards:** Install standardized e-waste collection bins at all major railway stations (Western & Central Lines) and municipal citizen ward offices.

> **Speaker Notes:**  
> "Rather than generic recommendations, our GIS results enable ward-specific interventions. For Kurla and Dharavi, the solution is formalizing the informal economy. For Andheri and BKC, the priority is corporate EPR compliance. For Govandi, mobile collection vehicles are required to eliminate distance barriers."

---

## SLIDE 15: CONCLUSION & PROJECT IMPACT
- **Key Takeaway:** GIS-based multi-criteria spatial analysis successfully bridges the gap between environmental policy and localized urban waste management.
- **Methodological Contribution:** Established a reproducible, open-data-ready spatial framework applicable to any Indian or Global South metropolis.
- **Interactive Decision-Support:** Developed a standalone interactive WebGIS dashboard allowing municipal officers to inspect ward-level indicators and metrics in real time.
- **Thank you! Questions & Discussion.**

> **Speaker Notes:**  
> "In conclusion, this project demonstrates that GIS is an indispensable tool for e-waste management. It allows municipal authorities to target their limited financial and administrative resources precisely where environmental risk and human vulnerability are highest. Thank you very much, and I welcome any questions from the panel."
