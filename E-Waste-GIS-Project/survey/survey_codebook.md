# SURVEY DATA DICTIONARY & VARIABLE CODEBOOK
## E-Waste Hotspot GIS Project — Greater Mumbai Field Survey

This document outlines the schema, variable types, value ranges, and coding schemes used for the primary survey dataset stored in:
- `data/sample/ewaste_field_survey_responses.csv`
- `survey/ewaste_field_survey_responses.csv`

---

## 1. Master Dataset Schema

| Column Name | Data Type | Permissible Values / Range | Description | Questionnaire Ref |
|---|---|---|---|---|
| `Respondent_ID` | String | `SRV_001` to `SRV_080` | Unique alphanumeric primary key | Section A (Q1) |
| `Ward` | String | A, B, C, D, E, F/S, F/N, G/S, G/N, H/E, H/W, K/E, K/W, L, M/E, M/W, N, P/S, P/N, R/S, R/C, R/N, S, T | Administrative MCGM Ward where survey was conducted | Section A (Q3) |
| `Respondent_Category` | Categorical | Residential Household, Commercial IT / Office, Electronics Retailer / Showroom, Mobile & Computer Repair Center, Scrap Dealer / Kabadiwala | Broad economic and behavioral sector of the surveyed entity | Section A (Q4) |
| `Occupants_or_Staff_Count` | Integer | 2 to 500 | Total occupants (household) or employees/technicians (commercial/institutional) | Section A (Q5) |
| `Discard_Frequency` | Categorical | Weekly, Monthly / Ongoing, Every 1-2 Years, Every 2-3 Years, Every 3-4 Years (Lease Renewal), Rarely / Only when broken, Daily / Continuous | Temporal rate at which devices are decommissioned or discarded | Section B (Q7) |
| `Estimated_Annual_EWaste_kg` | Float | 8.0 to 12,000.0 kg/year | Reported aggregate weight of discarded electronic equipment generated annually | Section B (Q8) |
| `Commonly_Discarded_Items` | String (Semicolon-separated) | Text list (e.g., Mobile Phones; Chargers & Cables; Batteries; Laptops) | Inventory of electronic equipment discarded or repaired within past 12–24 months | Section B (Q6) |
| `Primary_Disposal_Method` | Categorical | Stored in Cupboards/Drawers, Sold to Scrap Dealer (Kabadiwala), Exchange Offer on New Device, Mixed with Domestic Garbage, Dropped at Formal Recycler, Authorized E-Waste Recycler (EPR Certificate), Auctioned to Wholesale Scrap Dealer, Return to Brand / OEM Reverse Logistics, Sold to Informal E-Waste Scrap Collector, Sold to Secondary Dismantler (Kurla/Dharavi/Govandi) | Predominant pathway through which obsolete devices leave the premises | Section C (Q9) |
| `Awareness_of_EWaste_Rules` | Categorical | Unaware, Heard of it, Well Aware | Subjective awareness of India's E-Waste (Management) Rules & EPR legislation | Section D (Q12) |
| `Distance_to_Nearest_Formal_Facility_km` | Float | 0.5 to 8.0 km | Perceived / geocoded distance to nearest authorized e-waste collection center | Section D (Q13) |
| `Willingness_to_Use_Formal_System` | Categorical | Yes - If doorstep pickup, Yes - If incentive/discount offered, No - Too inconvenient, Yes - Formal documentation required, Yes - Regulated reverse logistics partner, Yes - If scrap price matched, No - Kabadiwala pays instant cash, Only if formal system guarantees livelihood / higher purchase margin | Key motivation or condition under which respondent would shift to formal recycling | Section D (Q14) |
| `Data_Label` | String | `Sample / Demonstration Survey Data` | Academic integrity tag designating demonstration calibration | Integrity Protocol |

---

## 2. Statistical Breakdown of Primary Survey (n = 80 Respondents)

### A. Distribution by Respondent Category
- **Residential Households:** 36 respondents (45.0%)
- **Commercial IT / Offices:** 18 respondents (22.5%)
- **Electronics Retailers / Showrooms:** 10 respondents (12.5%)
- **Mobile & Computer Repair Centers:** 10 respondents (12.5%)
- **Scrap Dealers / Kabadiwalas:** 6 respondents (7.5%)

### B. Summary of Disposal Behaviors
- **Hoarded in Cupboards / Storage:** 17.5% (predominantly residential)
- **Sold to Informal Scrap Dealer / Kabadiwala:** 27.5% (residential & repairers)
- **Secondary Dismantling / Informal Wholesale:** 15.0% (scrap dealers & repairers)
- **Retail Buyback / OEM Reverse Logistics:** 19.9% (commercial & retail)
- **Authorized Recyclers (EPR certified):** 11.2% (primarily mid-to-large corporate IT offices)
- **Mixed with Municipal Solid Waste (Garbage Bins):** 3.7% (residential and small micro-repairers)

### C. Regulatory Awareness
- **Completely Unaware:** 43.8%
- **Basic Awareness (Heard of rules):** 36.2%
- **Well Aware:** 20.0% (concentrated in large corporate entities and organized retail chains)

---

## 3. Protocol for Replacing Demonstration Data with Empirical Student Field Data
To substitute empirical field survey results collected by students:
1. Conduct field interviews using the questionnaire in `survey/ewaste_survey_questionnaire.md`.
2. Enter responses into a spreadsheet matching the exact column headers specified above.
3. Save the spreadsheet as CSV at `data/sample/ewaste_field_survey_responses.csv`.
4. Run `python scripts/06_generate_charts_and_stats.py` to re-generate survey charts and statistical outputs automatically.
