import type { Standard } from "@/lib/bis/types";

/**
 * Demo corpus of Indian Standards for BIS Saathi.
 *
 * Illustrative data assembled for a demonstration build. IS numbers, titles and
 * sectors follow real BIS conventions, but clause text, page numbers and test
 * lists are written for the demo and must not be treated as the published
 * standard. Always verify against the official BIS publication.
 */
export const standards: Standard[] = [
  {
    id: "std-17803",
    number: "IS 17803:2022",
    year: 2022,
    title: "Stainless Steel Vacuum Insulated Flasks and Bottles — Specification",
    sector: "Drinkware and Food Contact",
    scope:
      "Prescribes material, construction, thermal performance and safety requirements for double-walled stainless steel vacuum insulated flasks, bottles and tumblers intended to hold drinking water, tea, coffee and other beverages for domestic and travel use. Covers capacities from 200 ml to 3 litres.",
    keywords: [
      "water bottle",
      "stainless steel bottle",
      "bottle",
      "thermos",
      "flask",
      "vacuum flask",
      "insulated bottle",
      "sipper",
      "tumbler",
      "drinkware",
      "stainless steel",
      "hot and cold bottle",
    ],
    status: "active",
    qcoId: "qco-utensils",
    schemeId: "scheme-i",
    tests: [
      "Heat retention and cold retention over 6, 12 and 24 hours",
      "Vacuum integrity and seal leakage test",
      "Overall migration of constituents into food simulants",
      "Heavy metal migration — lead, cadmium, chromium, nickel",
      "Drop impact test from 1 m onto hardwood",
      "Corrosion resistance of the inner vessel",
    ],
    clauses: [
      {
        id: "std-17803-c1",
        number: "4.1",
        title: "Material of the inner vessel",
        text:
          "The inner vessel in direct contact with the beverage shall be manufactured from austenitic stainless steel of grade AISI 304 (X04Cr18Ni10) or better, conforming to IS 6911. Use of ferritic grades, recycled scrap of unverified origin or plated mild steel for the inner vessel is not permitted. The manufacturer shall retain mill test certificates for each heat number used in production.",
        page: 7,
      },
      {
        id: "std-17803-c2",
        number: "4.4",
        title: "Vacuum insulation and thermal performance",
        text:
          "The annular space between the inner and outer vessels shall be evacuated to a residual pressure not exceeding 0.1 Pa and hermetically sealed. When filled to 90 percent of rated capacity with water at 95 +/- 1 degree C and held at an ambient temperature of 20 +/- 2 degree C, the contents shall not fall below 70 degree C after 6 h and below 55 degree C after 24 h. Cold retention shall keep contents below 12 degree C after 6 h when charged at 4 degree C.",
        page: 9,
      },
      {
        id: "std-17803-c3",
        number: "5.2",
        title: "Migration limits for food contact surfaces",
        text:
          "Overall migration from surfaces in contact with the beverage, tested with 3 percent acetic acid and 10 percent ethanol simulants at 70 degree C for 2 h, shall not exceed 10 mg/dm2. Specific migration of lead shall not exceed 0.01 mg/kg, cadmium 0.005 mg/kg and nickel 0.14 mg/kg of simulant. Coatings, lacquers and printed decoration on the outer surface shall not transfer to the interior.",
        page: 13,
      },
      {
        id: "std-17803-c4",
        number: "6.1",
        title: "Closure, stopper and leakage",
        text:
          "The stopper assembly shall be of food-grade polypropylene or silicone and shall withstand 5 000 open-close cycles without loss of seal. When filled to rated capacity, closed and inverted for 30 min, the flask shall show no visible leakage. Any pressure-release feature shall vent before the internal pressure exceeds 50 kPa above ambient.",
        page: 16,
      },
      {
        id: "std-17803-c5",
        number: "8.1",
        title: "Marking and Standard Mark",
        text:
          "Each flask or bottle shall be legibly and indelibly marked with the manufacturer name or trade-mark, rated capacity in millilitres, stainless steel grade of the inner vessel, month and year of manufacture and batch number. Product covered by a licence shall additionally bear the Standard Mark as laid down in the Bureau of Indian Standards Act, 2016 and the Rules and Regulations made thereunder.",
        page: 21,
      },
    ],
    relatedIds: ["std-14756", "std-9845", "std-14543"],
  },
  {
    id: "std-14756",
    number: "IS 14756:2022",
    year: 2022,
    title: "Stainless Steel Utensils for Cooking, Serving and Storage of Food — Specification",
    sector: "Kitchenware and Utensils",
    scope:
      "Covers stainless steel utensils such as pans, kadhai, tope, thali, bowls, tiffin carriers and storage containers used for cooking, serving and storing food in domestic and institutional kitchens. Specifies grade, thickness, finish and migration requirements.",
    keywords: [
      "utensil",
      "stainless steel",
      "kadhai",
      "cookware",
      "tiffin",
      "lunch box",
      "thali",
      "steel plate",
      "storage container",
      "kitchen",
      "vessel",
    ],
    status: "active",
    qcoId: "qco-utensils",
    schemeId: "scheme-i",
    tests: [
      "Chemical composition of stainless steel by spectrometry",
      "Wall thickness and base thickness measurement",
      "Overall migration into food simulants",
      "Heavy metal specific migration",
      "Thermal shock resistance (heating and quenching cycles)",
      "Surface finish and freedom from sharp edges",
    ],
    clauses: [
      {
        id: "std-14756-c1",
        number: "4.2",
        title: "Grades of stainless steel permitted",
        text:
          "Utensils shall be fabricated from stainless steel conforming to grade 304, 316 or 202 of IS 6911 as declared by the manufacturer. Grade 202 shall not be used where the utensil is intended for prolonged storage of acidic foods. The declared grade shall be verifiable by spectrometric analysis on the finished article.",
        page: 6,
      },
      {
        id: "std-14756-c2",
        number: "5.1",
        title: "Minimum thickness",
        text:
          "The minimum wall thickness for cooking utensils shall be 0.5 mm and the minimum base thickness 0.8 mm for capacities up to 3 litres. For capacities above 3 litres these values shall be 0.6 mm and 1.0 mm respectively. Encapsulated sandwich bases shall be measured excluding the cladding layer.",
        page: 10,
      },
      {
        id: "std-14756-c3",
        number: "5.5",
        title: "Freedom from sharp edges and burrs",
        text:
          "Rims, handles and lid edges shall be rolled, beaded or otherwise finished so that no sharp edge or burr capable of causing injury remains. When tested with a sharp-edge tester of the type described in Annex C, no accessible edge shall be classified as sharp. Spot welds on handles shall withstand a static pull of three times the rated filled mass.",
        page: 12,
      },
      {
        id: "std-14756-c4",
        number: "7.1",
        title: "Migration requirements",
        text:
          "Overall migration determined in accordance with IS 9845 shall not exceed 10 mg/dm2 of contact surface. Specific migration limits of 0.01 mg/kg for lead, 0.005 mg/kg for cadmium and 0.1 mg/kg for chromium shall apply. Utensils that have been mechanically polished shall be tested after the polishing operation.",
        page: 17,
      },
    ],
    relatedIds: ["std-17803", "std-9845", "std-2347"],
  },
  {
    id: "std-16333-3",
    number: "IS 16333 (Part 3):2022",
    year: 2022,
    title:
      "Audio/Video, Information and Communication Technology Equipment — Part 3 Safety Requirements",
    sector: "Electronics and IT",
    scope:
      "Specifies safety requirements for audio, video, information and communication technology equipment rated up to 600 V, including laptops, tablets, smart televisions, set-top boxes, monitors and their power supplies. It is the hazard-based standard that replaces the earlier IS 13252 series.",
    keywords: [
      "laptop",
      "tablet",
      "television",
      "monitor",
      "set top box",
      "electronics",
      "it equipment",
      "smart tv",
      "adapter",
      "power supply",
      "safety",
      "crs",
    ],
    status: "active",
    qcoId: "qco-electronics",
    schemeId: "scheme-ii",
    tests: [
      "Electric strength (dielectric withstand) test",
      "Touch current and protective conductor current measurement",
      "Abnormal operation and single-fault condition test",
      "Temperature rise under normal operating conditions",
      "Fire enclosure and flammability classification of materials",
      "Mechanical strength — drop, impact and stress relief",
    ],
    clauses: [
      {
        id: "std-16333-3-c1",
        number: "4.1",
        title: "Hazard-based safety engineering approach",
        text:
          "Equipment shall be assessed by identifying energy sources, classifying them as class 1, class 2 or class 3, and providing safeguards appropriate to the class. An ordinary person shall not be exposed to a class 2 or class 3 energy source without at least one effective safeguard. Documentation of the energy source classification shall form part of the technical file submitted with the registration application.",
        page: 22,
      },
      {
        id: "std-16333-3-c2",
        number: "5.4",
        title: "Protection against electric shock",
        text:
          "Accessible conductive parts shall be separated from mains circuits by basic insulation plus protective earthing, or by double or reinforced insulation. Touch current measured with the network of Annex D shall not exceed 0.25 mA for class II equipment and 3.5 mA for class I equipment. Clearance and creepage distances shall be determined from the working voltage, pollution degree 2 and overvoltage category II unless otherwise justified.",
        page: 41,
      },
      {
        id: "std-16333-3-c3",
        number: "6.3",
        title: "Fire enclosure and material flammability",
        text:
          "Parts of a fire enclosure shall be of material classified V-1 or better, or shall pass the 5VB test where the enclosure has openings larger than those permitted in 6.4.8. Components carrying more than 15 W under single-fault conditions shall be mounted on material rated V-0 or shall be separated by a barrier. Ventilation openings in the bottom of an enclosure shall meet the baffle construction of Figure 12.",
        page: 58,
      },
      {
        id: "std-16333-3-c4",
        number: "10.2",
        title: "Battery and charging circuit safety",
        text:
          "Equipment containing a rechargeable lithium-ion battery shall incorporate protection against overcharge, overdischarge, overcurrent and thermal runaway. The battery pack shall comply with IS 16046 (Part 2). Charging shall cease if the cell surface temperature exceeds the manufacturer declared upper charging limit.",
        page: 96,
      },
    ],
    relatedIds: ["std-13252-1", "std-16046-2", "std-16102-1"],
  },
  {
    id: "std-13252-1",
    number: "IS 13252 (Part 1):2010",
    year: 2010,
    title: "Information Technology Equipment — Safety Part 1 General Requirements",
    sector: "Electronics and IT",
    scope:
      "Specifies safety requirements for mains-powered and battery-powered information technology equipment, including mobile phone chargers, power banks, adapters, printers and desktop computers. Long used as the base standard for the Compulsory Registration Scheme.",
    keywords: [
      "charger",
      "power bank",
      "adapter",
      "mobile phone",
      "printer",
      "computer",
      "it equipment",
      "electronics",
      "crs",
      "registration",
      "usb charger",
    ],
    status: "superseded",
    supersededBy: "IS 16333 (Part 3):2022",
    qcoId: "qco-electronics",
    schemeId: "scheme-ii",
    tests: [
      "Dielectric strength test at 3 000 V a.c. for mains circuits",
      "Leakage current measurement",
      "Ball pressure test on insulating material",
      "Humidity conditioning followed by electric strength",
      "Stability and mechanical hazard test",
      "Abnormal operating and fault condition test",
    ],
    clauses: [
      {
        id: "std-13252-1-c1",
        number: "1.1",
        title: "Scope and equipment covered",
        text:
          "This standard applies to mains-powered or battery-powered information technology equipment with a rated voltage not exceeding 600 V. It includes external power supply units, chargers and power banks supplied for use with such equipment. Equipment intended primarily for medical or industrial process control use is excluded.",
        page: 1,
      },
      {
        id: "std-13252-1-c2",
        number: "2.9",
        title: "Separation of hazardous voltage from SELV circuits",
        text:
          "Hazardous voltage circuits shall be separated from SELV circuits by double or reinforced insulation, or by basic insulation with a protective screen connected to protective earth. The transformer used to derive the SELV supply shall meet the insulation and construction requirements of 2.10.3. Under single-fault conditions the SELV circuit shall not exceed 42.4 V peak or 60 V d.c.",
        page: 34,
      },
      {
        id: "std-13252-1-c3",
        number: "4.7",
        title: "Resistance to fire",
        text:
          "Materials used for enclosures and internal parts shall have a flammability classification appropriate to their location and the power available. Where a component can dissipate more than 4 000 W under fault conditions, a fire enclosure of V-0 material shall be provided. Compliance is checked by inspection of component certificates and by the needle-flame test of Annex A where required.",
        page: 71,
      },
      {
        id: "std-13252-1-c4",
        number: "1.7",
        title: "Marking and instructions",
        text:
          "Equipment shall be marked with rated input voltage or voltage range, rated frequency, rated current and the manufacturer name or trade-mark. Products registered under the Compulsory Registration Scheme shall additionally carry the Self Declaration of Conformity mark with the registration number in the prescribed format. Marking shall remain legible after being rubbed with a cloth soaked in water and then in petroleum spirit.",
        page: 18,
      },
    ],
    relatedIds: ["std-16333-3", "std-16046-2"],
  },
  {
    id: "std-302-1",
    number: "IS 302 (Part 1):2008",
    year: 2008,
    title: "Safety of Household and Similar Electrical Appliances — Part 1 General Requirements",
    sector: "Household Appliances",
    scope:
      "Lays down general safety requirements for electrical appliances for household and similar use with a rated voltage not exceeding 250 V single-phase, covering shock, fire, mechanical and thermal hazards. It is the parent standard applied together with a Part 2 section for each appliance type.",
    keywords: [
      "appliance",
      "household",
      "electrical safety",
      "mixer",
      "iron",
      "heater",
      "fan",
      "kettle",
      "toaster",
      "isi mark",
      "shock",
    ],
    status: "active",
    qcoId: "qco-appliances",
    schemeId: "scheme-i",
    tests: [
      "Protection against access to live parts (test probe B)",
      "Input power and current measurement",
      "Heating test and temperature rise limits",
      "Leakage current and electric strength at operating temperature",
      "Moisture resistance — drip, splash and humidity treatment",
      "Endurance and abnormal operation tests",
    ],
    clauses: [
      {
        id: "std-302-1-c1",
        number: "8.1",
        title: "Protection against access to live parts",
        text:
          "Appliances shall be constructed and enclosed so that there is adequate protection against accidental contact with live parts. Compliance is checked with test probe B applied in every possible position, with the appliance in all positions of normal use and with detachable parts removed. Contact indicated by an electrical indicator operating at not less than 40 V constitutes a failure.",
        page: 29,
      },
      {
        id: "std-302-1-c2",
        number: "11.8",
        title: "Temperature rise limits",
        text:
          "Under normal operation the temperature rise of windings, terminals and accessible surfaces shall not exceed the values in Table 3. Handles held continuously in normal use shall not rise more than 30 K above ambient if of metal, 40 K if of porcelain and 50 K if of moulded material. The test is conducted until steady conditions are established with the appliance supplied at 1.06 times rated voltage.",
        page: 44,
      },
      {
        id: "std-302-1-c3",
        number: "16.3",
        title: "Electric strength",
        text:
          "Immediately after the leakage current test, the insulation shall withstand a substantially sinusoidal voltage applied for 1 min between live parts and accessible metal parts. The test voltage shall be 1 250 V for basic insulation of class I appliances and 3 750 V for reinforced insulation. No flashover or breakdown shall occur, though glow discharge without a drop in voltage is disregarded.",
        page: 61,
      },
      {
        id: "std-302-1-c4",
        number: "25.7",
        title: "Supply cords and cord anchorage",
        text:
          "Supply cords shall have a nominal cross-sectional area not less than that given in Table 11 for the rated current of the appliance. Cord anchorages shall relieve conductors from strain and from twisting where they connect to terminals, and shall be of insulating material or be provided with an insulating lining. After 25 pulls of the specified force and one minute of torque, the cord shall not have been displaced by more than 2 mm.",
        page: 88,
      },
    ],
    relatedIds: ["std-302-2-201", "std-694", "std-1293", "std-16058"],
  },
  {
    id: "std-302-2-201",
    number: "IS 302 (Part 2/Sec 201):2016",
    year: 2016,
    title:
      "Safety of Household Electrical Appliances — Part 2 Section 201 Particular Requirements for Mixers, Grinders and Food Processors",
    sector: "Household Appliances",
    scope:
      "Supplements IS 302 (Part 1) with particular safety requirements for kitchen machines such as mixer grinders, wet grinders, food processors, blenders and juicers for household use. Addresses blade access, jar locking and motor overheating.",
    keywords: [
      "mixer grinder",
      "mixie",
      "blender",
      "food processor",
      "juicer",
      "wet grinder",
      "kitchen appliance",
      "grinder",
      "household",
      "blade",
    ],
    status: "active",
    qcoId: "qco-appliances",
    schemeId: "scheme-i",
    tests: [
      "Interlock reliability test on jar and lid",
      "Motor temperature rise on load and stall",
      "Endurance test of 500 operating cycles",
      "Access to moving blades using test probe",
      "Overall stability on inclined plane",
      "Leakage current after humidity treatment",
    ],
    clauses: [
      {
        id: "std-302-2-201-c1",
        number: "20.101",
        title: "Protection against access to moving blades",
        text:
          "It shall not be possible to touch the cutting blades with test probe B when the jar is fitted in the position of normal use. Appliances shall be fitted with an interlock that removes power before the blade becomes accessible, and the blade shall come to rest within 1.5 s of the interlock operating. Compliance is checked on ten samples of the interlock after the endurance test of 19.101.",
        page: 12,
      },
      {
        id: "std-302-2-201-c2",
        number: "11.101",
        title: "Motor temperature under load",
        text:
          "The appliance shall be operated with the maximum load declared in the instructions, on the duty cycle declared by the manufacturer, until steady conditions are reached. The winding temperature rise shall not exceed 75 K for class A insulation and 95 K for class E insulation. A thermal cut-out that operates during the test shall be of the non-self-resetting type or shall be shown to be reliable over 10 000 cycles.",
        page: 8,
      },
      {
        id: "std-302-2-201-c3",
        number: "22.101",
        title: "Jar and coupling construction",
        text:
          "Jars of glass shall withstand a thermal shock of 60 K and a drop of 300 mm onto a hardwood surface without shattering. Metal jars in contact with food shall be of stainless steel conforming to IS 6911 or of aluminium with an approved food-grade coating. The drive coupling shall not fail in a manner that exposes the blade or ejects fragments.",
        page: 15,
      },
      {
        id: "std-302-2-201-c4",
        number: "7.101",
        title: "Instructions for the user",
        text:
          "The instruction sheet shall state the maximum continuous running time, the required rest interval between cycles and the maximum load for each jar. It shall carry a warning against operating the appliance with the jar removed and against inserting utensils while the motor is running. Instructions shall be in Hindi and English at minimum.",
        page: 5,
      },
    ],
    relatedIds: ["std-302-1", "std-14756"],
  },
  {
    id: "std-1786",
    number: "IS 1786:2008",
    year: 2008,
    title:
      "High Strength Deformed Steel Bars and Wires for Concrete Reinforcement — Specification",
    sector: "Steel and Metals",
    scope:
      "Covers high strength deformed bars and wires, commonly called TMT bars, used as reinforcement in concrete. Specifies grades Fe 415 to Fe 600, including corrosion resistant and earthquake resistant variants, with requirements for chemical composition, mechanical properties and rib geometry.",
    keywords: [
      "tmt bar",
      "steel",
      "rebar",
      "sariya",
      "reinforcement bar",
      "deformed bar",
      "construction steel",
      "fe 500",
      "fe 550",
      "concrete",
      "iron rod",
    ],
    status: "active",
    qcoId: "qco-steel",
    schemeId: "scheme-i",
    tests: [
      "Tensile test — yield stress, ultimate tensile strength, elongation",
      "Bend and rebend test",
      "Chemical analysis for carbon, sulphur, phosphorus",
      "Mass per metre and nominal diameter check",
      "Rib geometry and relative rib area measurement",
      "Corrosion resistance test for CRS grades",
    ],
    clauses: [
      {
        id: "std-1786-c1",
        number: "5.1",
        title: "Chemical composition limits",
        text:
          "The ladle analysis of bars shall not exceed 0.30 percent carbon, 0.055 percent sulphur, 0.055 percent phosphorus and 0.105 percent sulphur plus phosphorus for grade Fe 415. For Fe 500 and higher grades the carbon limit is 0.30 percent with sulphur and phosphorus each restricted to 0.055 percent. Product analysis is permitted a positive variation of 0.02 percent on carbon and 0.005 percent on sulphur and phosphorus.",
        page: 4,
      },
      {
        id: "std-1786-c2",
        number: "6.1",
        title: "Mechanical properties",
        text:
          "Grade Fe 500D shall have a minimum 0.2 percent proof stress of 500 N/mm2, a minimum tensile strength of 565 N/mm2 and a minimum elongation of 16 percent on a gauge length of 5.65 times the square root of the cross-sectional area. The ratio of actual tensile strength to actual proof stress shall be not less than 1.10. Every test result shall be reported against the cast or heat number.",
        page: 6,
      },
      {
        id: "std-1786-c3",
        number: "7.2",
        title: "Bend and rebend test",
        text:
          "Bars shall withstand bending through 180 degrees around a mandrel of diameter not exceeding four times the nominal bar diameter for sizes up to 20 mm. For the rebend test the bar is bent through 135 degrees, aged in boiling water at 100 degree C for 30 min, then bent back to 157.5 degrees. The bar shall show no rupture or visible crack at the bend when examined with normal or corrected vision.",
        page: 9,
      },
      {
        id: "std-1786-c4",
        number: "9.1",
        title: "Rolling marks and identification",
        text:
          "Each bar shall be rolled with continuous identification marks giving the producer mark, the grade and the source of manufacture, repeated at intervals not exceeding 1 m. Bundles shall carry a metal tag bearing the cast number, grade, nominal diameter and the licence number where the Standard Mark is applied. Marking shall permit traceability from the site back to the heat.",
        page: 14,
      },
    ],
    relatedIds: ["std-2062", "std-277", "std-269"],
  },
  {
    id: "std-2062",
    number: "IS 2062:2011",
    year: 2011,
    title: "Hot Rolled Medium and High Tensile Structural Steel — Specification",
    sector: "Steel and Metals",
    scope:
      "Covers hot rolled structural steel plates, sections, flats and bars in grades E250 to E650 used in structures subject to static and dynamic loading, including bridges, industrial sheds and transmission towers. Defines quality designations A, BR, B0 and C by impact requirement.",
    keywords: [
      "structural steel",
      "steel plate",
      "angle",
      "channel",
      "beam",
      "e250",
      "mild steel",
      "hot rolled",
      "fabrication",
      "girder",
    ],
    status: "active",
    qcoId: "qco-steel",
    schemeId: "scheme-i",
    tests: [
      "Tensile test on longitudinal and transverse samples",
      "Charpy V-notch impact test at 0 and -20 degree C",
      "Bend test around specified mandrel",
      "Ladle and product chemical analysis",
      "Carbon equivalent calculation for weldability",
      "Ultrasonic testing of plates where specified",
    ],
    clauses: [
      {
        id: "std-2062-c1",
        number: "6.1",
        title: "Tensile requirements for grade E250",
        text:
          "Grade E250 steel shall have a minimum yield stress of 250 N/mm2 for thicknesses up to 20 mm, reducing to 230 N/mm2 above 40 mm. The tensile strength shall be not less than 410 N/mm2 and the percentage elongation on a gauge length of 5.65 times the square root of the area shall be not less than 23 percent. Test pieces shall be taken in accordance with IS 1608.",
        page: 8,
      },
      {
        id: "std-2062-c2",
        number: "6.3",
        title: "Impact requirement by quality designation",
        text:
          "Quality BR shall show an average Charpy V-notch absorbed energy of not less than 27 J at room temperature, quality B0 at 0 degree C and quality C at minus 20 degree C. Three specimens constitute a set and only one value may fall below the specified average, provided it is not below 70 percent of it. Impact testing is not required for quality A.",
        page: 10,
      },
      {
        id: "std-2062-c3",
        number: "5.3",
        title: "Carbon equivalent for weldability",
        text:
          "The carbon equivalent computed as C + Mn/6 + (Cr + Mo + V)/5 + (Ni + Cu)/15 shall not exceed 0.42 for grade E250 quality BR. Where the purchaser requires guaranteed weldability without preheat, a maximum carbon equivalent of 0.39 may be agreed at the time of enquiry. The value shall be reported on the test certificate for each cast.",
        page: 7,
      },
      {
        id: "std-2062-c4",
        number: "11.1",
        title: "Marking of finished product",
        text:
          "Each plate, section or bundle shall be marked with the manufacturer name or trade-mark, grade and quality designation, and the cast number. Where the material is covered by a BIS licence the Standard Mark shall be applied in accordance with the licence conditions. Colour coding at bar ends may be used in addition but shall not replace legible marking.",
        page: 19,
      },
    ],
    relatedIds: ["std-1786", "std-277"],
  },
  {
    id: "std-277",
    number: "IS 277:2018",
    year: 2018,
    title: "Galvanized Steel Strip and Sheet (Plain and Corrugated) — Specification",
    sector: "Steel and Metals",
    scope:
      "Specifies requirements for hot-dip zinc coated steel sheets and strips, plain or corrugated, used for roofing, cladding, ducting and general fabrication. Covers coating mass designations, bend performance and surface finish.",
    keywords: [
      "gi sheet",
      "galvanized sheet",
      "roofing sheet",
      "corrugated sheet",
      "zinc coating",
      "tin shed",
      "steel sheet",
      "cladding",
      "chadar",
    ],
    status: "active",
    qcoId: "qco-steel",
    schemeId: "scheme-i",
    tests: [
      "Coating mass determination by stripping",
      "Adhesion of zinc coating by bend test",
      "Tensile test on base metal",
      "Thickness measurement of base metal and coating",
      "Uniformity of coating — Preece test",
      "Corrugation pitch and depth verification",
    ],
    clauses: [
      {
        id: "std-277-c1",
        number: "7.1",
        title: "Coating mass designation",
        text:
          "Coating mass shall be expressed in grams per square metre as the total on both surfaces, in designations from 120 to 600. The triple-spot test average shall be not less than the designated value and no single spot shall fall below 85 percent of it. Sheets for outdoor roofing shall be of designation 275 or higher unless otherwise agreed.",
        page: 9,
      },
      {
        id: "std-277-c2",
        number: "8.2",
        title: "Adhesion of coating",
        text:
          "When a test piece is bent through 180 degrees around a mandrel whose diameter is specified in Table 5 for the grade and thickness, the zinc coating shall not flake or peel from the base metal on the outside of the bend. Slight cracking of the coating without loss of adhesion is not a cause for rejection. Adhesive tape applied to the bend and removed shall not lift coating.",
        page: 12,
      },
      {
        id: "std-277-c3",
        number: "6.1",
        title: "Base metal thickness tolerance",
        text:
          "The nominal thickness of the base metal excluding coating shall be as ordered, with a tolerance of plus or minus 0.03 mm for nominal thicknesses up to 0.60 mm. Thickness shall be measured at not less than 40 mm from any edge. Sheets described by gauge number shall additionally state the nominal thickness in millimetres on the invoice and the marking.",
        page: 7,
      },
      {
        id: "std-277-c4",
        number: "12.1",
        title: "Marking",
        text:
          "Each bundle or coil shall carry a durable label stating the manufacturer name, grade, coating mass designation, nominal thickness, width and length, and the lot number. Individual corrugated sheets shall be stencilled with the manufacturer identification and coating designation. The Standard Mark may be applied under a licence granted by the Bureau.",
        page: 18,
      },
    ],
    relatedIds: ["std-2062", "std-1786"],
  },
  {
    id: "std-269",
    number: "IS 269:2015",
    year: 2015,
    title: "Ordinary Portland Cement — Specification",
    sector: "Cement and Construction",
    scope:
      "Consolidated specification for ordinary Portland cement of 33, 43 and 53 grades, covering chemical composition, fineness, setting time, soundness and compressive strength. Supersedes the separate grade-wise standards previously in force.",
    keywords: [
      "cement",
      "opc",
      "portland cement",
      "43 grade",
      "53 grade",
      "concrete",
      "construction",
      "bag",
      "binder",
      "mortar",
    ],
    status: "active",
    qcoId: "qco-cement",
    schemeId: "scheme-i",
    tests: [
      "Compressive strength at 3, 7 and 28 days",
      "Fineness by Blaine air permeability",
      "Initial and final setting time by Vicat apparatus",
      "Soundness by Le Chatelier and autoclave expansion",
      "Chemical analysis — lime saturation factor, insoluble residue, magnesia",
      "Chloride content determination",
    ],
    clauses: [
      {
        id: "std-269-c1",
        number: "5.1",
        title: "Chemical requirements",
        text:
          "The lime saturation factor shall lie between 0.80 and 1.02, the ratio of alumina to iron oxide shall be not less than 0.66 and insoluble residue shall not exceed 5.0 percent by mass. Magnesia shall not exceed 6.0 percent and total sulphur as sulphuric anhydride shall not exceed 3.5 percent for 53 grade. Chloride content shall not exceed 0.1 percent for cement used in plain and reinforced concrete.",
        page: 5,
      },
      {
        id: "std-269-c2",
        number: "6.2",
        title: "Compressive strength",
        text:
          "Mortar cubes of 70.6 mm side made and cured as described in IS 4031 (Part 6) shall attain a minimum compressive strength of 27, 37 and 53 N/mm2 at 28 days for grades 33, 43 and 53 respectively. The 3-day and 7-day minima are given in Table 3 and shall also be satisfied. The average of three cubes is taken as the result, with no individual value differing by more than 15 percent from the average.",
        page: 8,
      },
      {
        id: "std-269-c3",
        number: "6.4",
        title: "Setting time and soundness",
        text:
          "The initial setting time shall be not less than 30 min and the final setting time not more than 600 min when tested by the Vicat apparatus. Expansion measured by the Le Chatelier method shall not exceed 10 mm and autoclave expansion shall not exceed 0.8 percent. Where the Le Chatelier value is exceeded, the cement may be retested after aeration for not more than 7 days.",
        page: 10,
      },
      {
        id: "std-269-c4",
        number: "9.1",
        title: "Packing and marking",
        text:
          "Cement shall be packed in bags of 50 kg net mass, with the average of a sample of twenty bags not less than 50 kg and no individual bag below 48.5 kg. Each bag shall be legibly marked with the manufacturer name, grade, week and year of packing, net mass and the maximum retail price. The Standard Mark and licence number shall be printed on the bag when the product is covered by a licence.",
        page: 15,
      },
    ],
    relatedIds: ["std-8112", "std-1727", "std-1786", "std-1237"],
  },
  {
    id: "std-8112",
    number: "IS 8112:2013",
    year: 2013,
    title: "Ordinary Portland Cement, 43 Grade — Specification",
    sector: "Cement and Construction",
    scope:
      "Specifies requirements for 43 grade ordinary Portland cement used in general construction, plastering and masonry. Retained here for reference to legacy licences and older project specifications.",
    keywords: [
      "cement",
      "43 grade",
      "opc 43",
      "portland cement",
      "plaster",
      "masonry",
      "construction",
      "concrete",
    ],
    status: "superseded",
    supersededBy: "IS 269:2015",
    qcoId: "qco-cement",
    schemeId: "scheme-i",
    tests: [
      "Compressive strength at 3, 7 and 28 days",
      "Fineness by Blaine air permeability",
      "Setting time by Vicat apparatus",
      "Soundness by Le Chatelier expansion",
      "Chemical analysis of major oxides",
    ],
    clauses: [
      {
        id: "std-8112-c1",
        number: "6.1",
        title: "Strength requirement for 43 grade",
        text:
          "The average compressive strength of mortar cubes shall be not less than 23 N/mm2 at 3 days, 33 N/mm2 at 7 days and 43 N/mm2 at 28 days. The 28-day strength shall not exceed 58 N/mm2 where the cement is supplied against a 43 grade order. Testing follows the procedure of IS 4031 (Part 6).",
        page: 6,
      },
      {
        id: "std-8112-c2",
        number: "5.2",
        title: "Fineness",
        text:
          "The specific surface of the cement determined by the Blaine air permeability method shall be not less than 225 m2/kg. Fineness shall be reported to the nearest 5 m2/kg. Cement failing this requirement shall not be despatched even if strength requirements are met.",
        page: 5,
      },
      {
        id: "std-8112-c3",
        number: "10.1",
        title: "Transition to the consolidated standard",
        text:
          "Licences granted against this specification remain valid until their stated expiry, after which conformity is to be demonstrated against IS 269. Purchasers writing new tenders are advised to refer to the consolidated standard. Stock manufactured before the transition date may continue to be marked with the superseded number until exhausted.",
        page: 13,
      },
    ],
    relatedIds: ["std-269"],
  },
  {
    id: "std-1727",
    number: "IS 1727:1967",
    year: 1967,
    title: "Methods of Test for Pozzolanic Materials",
    sector: "Cement and Construction",
    scope:
      "Prescribes the laboratory methods for testing pozzolanic materials such as fly ash, calcined clay and silica fume used as a constituent of blended cement or as a partial replacement for cement in concrete.",
    keywords: [
      "fly ash",
      "pozzolana",
      "ppc",
      "blended cement",
      "silica fume",
      "test method",
      "concrete",
      "calcined clay",
      "admixture",
    ],
    status: "active",
    schemeId: "scheme-i",
    tests: [
      "Lime reactivity of pozzolana",
      "Fineness by wet sieving on 45 micron sieve",
      "Specific gravity determination",
      "Drying shrinkage of mortar bars",
      "Soundness by autoclave expansion",
    ],
    clauses: [
      {
        id: "std-1727-c1",
        number: "8.1",
        title: "Lime reactivity test",
        text:
          "Mortar cubes of 50 mm side are cast from a mixture of hydrated lime, standard sand and the pozzolana under test in the proportions given in 8.2. The cubes are cured at 50 +/- 2 degree C and 90 percent relative humidity for eight days before being tested in compression. The average compressive strength of three cubes is reported as the lime reactivity in N/mm2.",
        page: 14,
      },
      {
        id: "std-1727-c2",
        number: "5.2",
        title: "Fineness by wet sieving",
        text:
          "A representative sample of one gram is washed through a 45 micron IS sieve using a gentle stream of water until the effluent runs clear. The residue is dried, weighed and expressed as a percentage of the original mass. Duplicate determinations shall not differ by more than 1 percent absolute.",
        page: 8,
      },
      {
        id: "std-1727-c3",
        number: "11.1",
        title: "Drying shrinkage of mortar bars",
        text:
          "Mortar bars 25 mm by 25 mm by 285 mm are cast, cured in water for 28 days and then stored in air at 27 +/- 2 degree C and 50 percent relative humidity. The change in length at 28 days of air storage is reported as the drying shrinkage percentage. Blended cement containing the pozzolana shall not exhibit shrinkage exceeding 0.15 percent.",
        page: 21,
      },
    ],
    relatedIds: ["std-269", "std-8112"],
  },
  {
    id: "std-3495",
    number: "IS 3495:2019",
    year: 2019,
    title: "Methods of Tests of Burnt Clay Building Bricks (Parts 1 to 4)",
    sector: "Cement and Construction",
    scope:
      "Covers the determination of compressive strength, water absorption, efflorescence and warpage of burnt clay building bricks. Applied by testing laboratories to verify conformity of bricks supplied to construction sites.",
    keywords: [
      "brick",
      "burnt clay brick",
      "masonry",
      "efflorescence",
      "water absorption",
      "compressive strength",
      "construction",
      "wall",
      "clay brick",
    ],
    status: "active",
    schemeId: "scheme-i",
    tests: [
      "Compressive strength of individual bricks",
      "Water absorption by 24 hour immersion",
      "Efflorescence rating by evaporation",
      "Warpage measurement — concave and convex",
      "Dimensional tolerance on a stack of 20 bricks",
    ],
    clauses: [
      {
        id: "std-3495-c1",
        number: "2.3",
        title: "Compressive strength procedure",
        text:
          "The bed faces of the brick are ground or the frog is filled flush with a 1:1 cement mortar and the specimen is immersed in water at 27 +/- 2 degree C for three days. Load is applied axially at a uniform rate of 14 N/mm2 per minute until failure. The compressive strength is the maximum load divided by the average area of the bed faces, reported to the nearest 0.1 N/mm2.",
        page: 4,
      },
      {
        id: "std-3495-c2",
        number: "3.2",
        title: "Water absorption",
        text:
          "Dry bricks are weighed and then completely immersed in clean water at 27 +/- 2 degree C for 24 h. The specimen is removed, wiped of traces of water with a damp cloth and weighed again within three minutes. Water absorption expressed as a percentage of the dry mass shall not exceed 20 percent for common burnt clay bricks of class 12.5 and below.",
        page: 8,
      },
      {
        id: "std-3495-c3",
        number: "4.3",
        title: "Efflorescence rating",
        text:
          "The brick is placed on end in a dish containing 25 mm depth of distilled water in a well-ventilated room until all water is absorbed and evaporated, then the process is repeated once. The deposit is then rated as nil, slight, moderate, heavy or serious as defined in 4.4. Bricks rated moderate or worse shall not be used in exposed masonry.",
        page: 11,
      },
    ],
    relatedIds: ["std-1237", "std-4082", "std-269"],
  },
  {
    id: "std-1237",
    number: "IS 1237:2012",
    year: 2012,
    title: "Cement Concrete Flooring Tiles — Specification",
    sector: "Cement and Construction",
    scope:
      "Specifies material, dimensional, strength and wear requirements for cement concrete flooring tiles, including plain, coloured and chequered tiles used for indoor and outdoor flooring.",
    keywords: [
      "floor tile",
      "tiles",
      "cement tile",
      "chequered tile",
      "flooring",
      "paver",
      "concrete tile",
      "construction",
    ],
    status: "active",
    schemeId: "scheme-i",
    tests: [
      "Transverse strength test",
      "Water absorption of tile",
      "Resistance to wear by abrasion",
      "Dimensional and thickness tolerance check",
      "Perpendicularity and flatness of surface",
    ],
    clauses: [
      {
        id: "std-1237-c1",
        number: "5.1",
        title: "Composition of wearing layer",
        text:
          "The wearing layer shall be not less than 5 mm thick for general purpose tiles and shall be composed of cement, marble or stone chips and mineral pigments in the proportions declared by the manufacturer. Ordinary Portland cement conforming to IS 269 or white cement conforming to IS 8042 shall be used. Pigments shall be light-fast and free from lead and chromium compounds.",
        page: 5,
      },
      {
        id: "std-1237-c2",
        number: "7.2",
        title: "Transverse strength",
        text:
          "Tiles shall be tested on a span equal to the nominal side less 20 mm with the load applied at midspan through a steel rod. The average transverse strength of six tiles shall be not less than 3 N/mm2 with no individual value below 2.5 N/mm2. Tiles shall be immersed in water for 24 h before testing.",
        page: 9,
      },
      {
        id: "std-1237-c3",
        number: "7.4",
        title: "Resistance to wear",
        text:
          "The average wear of tiles when tested on the abrasion machine of IS 1237 Annex D shall not exceed 3.5 mm, with no individual value exceeding 4.0 mm for general purpose tiles. For heavy duty tiles the corresponding limits are 2.0 mm and 2.5 mm. The test is conducted on three specimens taken from different tiles.",
        page: 12,
      },
      {
        id: "std-1237-c4",
        number: "10.1",
        title: "Marking",
        text:
          "Each consignment shall be marked with the manufacturer name or trade-mark, the type and size of tile, the batch number and the date of manufacture. Where tiles are covered by a licence, the Standard Mark shall be applied to the packing and to a proportion of the tiles as required by the licence. Colour shade numbers shall be stated on the delivery note.",
        page: 16,
      },
    ],
    relatedIds: ["std-3495", "std-269"],
  },
  {
    id: "std-4082",
    number: "IS 4082:1996",
    year: 1996,
    title: "Recommendations on Stacking and Storage of Construction Materials and Components at Site",
    sector: "Cement and Construction",
    scope:
      "Gives recommendations for the stacking and storage of cement, steel, bricks, aggregates, timber, paints and other materials at a construction site so that quality is preserved and hazards are avoided.",
    keywords: [
      "storage",
      "stacking",
      "site",
      "construction",
      "warehouse",
      "godown",
      "cement storage",
      "material handling",
      "safety",
    ],
    status: "active",
    tests: [
      "Verification of stack height and spacing at site",
      "Moisture check on stored cement bags",
      "Inspection of dunnage and damp-proof separation",
      "Fire clearance check for combustible stores",
    ],
    clauses: [
      {
        id: "std-4082-c1",
        number: "4.2",
        title: "Storage of cement bags",
        text:
          "Cement bags shall be stored in a dry enclosed shed on a raised platform at least 200 mm above the floor and at least 300 mm clear of external walls. Stacks shall not exceed ten bags in height to avoid lumping under pressure, and shall be arranged so that the earliest consignment is consumed first. Bags shall be covered with waterproof sheets if temporary outdoor storage is unavoidable.",
        page: 4,
      },
      {
        id: "std-4082-c2",
        number: "5.1",
        title: "Stacking of reinforcement steel",
        text:
          "Steel reinforcement shall be stored above ground level on timber sleepers or masonry supports spaced not more than 2 m apart to prevent contact with soil and standing water. Bars of different diameters and grades shall be stacked separately and tagged with the cast number. Where storage exceeds three months a protective coating or covered storage shall be provided.",
        page: 7,
      },
      {
        id: "std-4082-c3",
        number: "7.3",
        title: "Stacking of bricks and blocks",
        text:
          "Bricks shall be stacked on firm dry ground in rows of not more than ten bricks in height, with each stack not exceeding 50 bricks in length and 4 m in width. Stacks shall be separated by clear passages of at least 800 mm for handling. Bricks of different classes shall not be mixed within a stack.",
        page: 11,
      },
    ],
    relatedIds: ["std-3495", "std-15883-1", "std-269"],
  },
  {
    id: "std-15883-1",
    number: "IS 15883 (Part 1):2009",
    year: 2009,
    title: "Construction Project Management — Guidelines Part 1 General",
    sector: "Cement and Construction",
    scope:
      "Provides guidelines on the planning, organisation, monitoring and closure of construction projects, including scope definition, work breakdown, risk management and quality assurance arrangements.",
    keywords: [
      "project management",
      "construction",
      "planning",
      "quality assurance",
      "risk",
      "schedule",
      "contract",
      "guidelines",
    ],
    status: "active",
    tests: [
      "Documentation audit of the project quality plan",
      "Verification of work breakdown structure coverage",
      "Review of risk register completeness",
      "Assessment of inspection and test plan compliance",
    ],
    clauses: [
      {
        id: "std-15883-1-c1",
        number: "5.2",
        title: "Project quality plan",
        text:
          "A project quality plan shall be prepared before the commencement of work and shall identify the applicable Indian Standards for each material and workmanship item. It shall define the frequency of sampling, the responsible testing agency and the acceptance criteria. The plan shall be reviewed whenever the design or the material source changes.",
        page: 12,
      },
      {
        id: "std-15883-1-c2",
        number: "6.4",
        title: "Inspection and test plan",
        text:
          "The inspection and test plan shall list, for each activity, the hold points, witness points and review points along with the recording format. Materials such as cement, reinforcement steel and aggregates shall be tested at the frequency laid down in the relevant material standard. Records shall be retained for the defect liability period plus three years.",
        page: 18,
      },
      {
        id: "std-15883-1-c3",
        number: "8.1",
        title: "Risk identification and register",
        text:
          "Risks shall be identified at the outset under the categories of design, procurement, construction, statutory and financial, and recorded in a register with an owner and a mitigation action. The register shall be reviewed at each project review meeting. Risks with a high likelihood and high impact shall be escalated to the project sponsor.",
        page: 25,
      },
    ],
    relatedIds: ["std-4082", "std-269"],
  },
  {
    id: "std-9873-1",
    number: "IS 9873 (Part 1):2019",
    year: 2019,
    title: "Safety of Toys — Part 1 Mechanical and Physical Properties",
    sector: "Toys and Children's Products",
    scope:
      "Specifies requirements for the mechanical and physical properties of toys intended for use by children under 14 years, addressing choking hazards, sharp points and edges, small parts, cords and projectile toys.",
    keywords: [
      "toy",
      "toys",
      "small parts",
      "choking hazard",
      "children",
      "soft toy",
      "rattle",
      "puzzle",
      "playing",
      "kids",
      "doll",
    ],
    status: "active",
    qcoId: "qco-toys",
    schemeId: "scheme-i",
    tests: [
      "Small parts cylinder test",
      "Sharp edge and sharp point test",
      "Torque, tension and compression tests on components",
      "Drop test from 850 mm",
      "Impact test with 1 kg mass",
      "Cord and elastic length measurement",
    ],
    clauses: [
      {
        id: "std-9873-1-c1",
        number: "4.1",
        title: "Small parts and choking hazard",
        text:
          "Toys intended for children under 36 months, and any removable or detachable component of such toys, shall not fit entirely within the small parts cylinder described in 5.2 when tested before and after the use and abuse tests. This applies to components liberated during the torque, tension, drop and impact tests. Toys that fail shall carry the prescribed age warning and shall not be sold for the under-36-month age group.",
        page: 9,
      },
      {
        id: "std-9873-1-c2",
        number: "4.6",
        title: "Sharp points and sharp edges",
        text:
          "Accessible edges and points on toys for children under 96 months shall not be hazardously sharp when assessed with the sharp edge tester and the sharp point tester of Annex A and Annex B. Functional sharp edges necessary for the toy to work shall carry a permanent warning on the packaging. Metal edges produced by stamping shall be rolled, curled or covered.",
        page: 14,
      },
      {
        id: "std-9873-1-c3",
        number: "4.11",
        title: "Cords, straps and elastics",
        text:
          "Cords on toys intended for children under 18 months shall not exceed 220 mm in length when measured under a 25 N load. Loops or cords forming a perimeter greater than 380 mm shall not be present on toys for cot or playpen use. Retractable cords shall not retract with a force exceeding that specified in 4.11.4.",
        page: 22,
      },
      {
        id: "std-9873-1-c4",
        number: "7.2",
        title: "Warnings and age grading",
        text:
          "Packaging shall bear the age grading and, where applicable, the warning that the toy is not suitable for children under 36 months together with the reason. Warnings shall be in Hindi and English and shall be legible at the point of sale without opening the package. The manufacturer or importer name and address shall appear on the packaging.",
        page: 41,
      },
    ],
    relatedIds: ["std-9873-3", "std-15644"],
  },
  {
    id: "std-9873-3",
    number: "IS 9873 (Part 3):2017",
    year: 2017,
    title: "Safety of Toys — Part 3 Migration of Certain Elements",
    sector: "Toys and Children's Products",
    scope:
      "Specifies maximum acceptable levels and methods of sampling and testing for the migration of antimony, arsenic, barium, cadmium, chromium, lead, mercury and selenium from toy materials that a child may ingest.",
    keywords: [
      "toy",
      "heavy metals",
      "lead",
      "cadmium",
      "migration",
      "paint",
      "children",
      "toxic",
      "chemical safety",
      "kids",
    ],
    status: "active",
    qcoId: "qco-toys",
    schemeId: "scheme-i",
    tests: [
      "Migration of eight elements into 0.07 M hydrochloric acid",
      "Sample preparation by scraping of coatings",
      "Determination by ICP-OES or atomic absorption",
      "Phthalate content screening on soft plastics",
      "Total lead content in surface coating",
    ],
    clauses: [
      {
        id: "std-9873-3-c1",
        number: "4.1",
        title: "Maximum migration limits",
        text:
          "The migration of soluble elements from toy materials shall not exceed 60 mg/kg for lead, 75 mg/kg for cadmium, 60 mg/kg for chromium, 1 000 mg/kg for barium and 60 mg/kg for mercury. Values are corrected for analytical variation as described in 8.3. Each accessible material of a distinct colour or composition is tested separately.",
        page: 7,
      },
      {
        id: "std-9873-3-c2",
        number: "6.2",
        title: "Extraction procedure",
        text:
          "Test portions are agitated with 0.07 M hydrochloric acid at 37 +/- 2 degree C for 1 h and then allowed to stand without agitation for a further 1 h to simulate conditions in the stomach. The extract is separated by filtration or centrifugation without delay and stabilised before analysis. The ratio of extraction liquid to test portion shall be 50 to 1 by mass.",
        page: 13,
      },
      {
        id: "std-9873-3-c3",
        number: "5.1",
        title: "Selection of accessible materials",
        text:
          "Only materials that are accessible to the child in normal use and after the abuse tests of IS 9873 (Part 1) need be tested. Coatings, printing inks, textiles, modelling clay, paints and pliable plastics are all treated as accessible materials. Where a material weighs less than 10 mg it may be exempted with justification recorded in the test report.",
        page: 10,
      },
    ],
    relatedIds: ["std-9873-1", "std-15644"],
  },
  {
    id: "std-15644",
    number: "IS 15644:2006",
    year: 2006,
    title: "Safety of Electric Toys",
    sector: "Toys and Children's Products",
    scope:
      "Specifies safety requirements for toys having at least one function dependent on electricity, including battery-operated ride-ons, remote controlled cars, electronic learning toys and toy transformers.",
    keywords: [
      "electric toy",
      "battery toy",
      "remote control car",
      "ride on",
      "toy",
      "children",
      "electronic toy",
      "kids",
      "rc car",
    ],
    status: "active",
    qcoId: "qco-toys",
    schemeId: "scheme-i",
    tests: [
      "Temperature rise of accessible surfaces",
      "Battery compartment security and short circuit test",
      "Electric strength after humidity treatment",
      "Mechanical strength — drop and impact",
      "Marking durability test",
    ],
    clauses: [
      {
        id: "std-15644-c1",
        number: "5.1",
        title: "Limitation of supply voltage",
        text:
          "Toys shall not be supplied at a nominal voltage exceeding 24 V and no accessible part shall exceed 24 V measured against earth. Toys intended to be connected to the mains shall be supplied through a toy transformer complying with IS 13252 or through an isolating supply unit. Direct connection of a toy to the mains supply is not permitted.",
        page: 6,
      },
      {
        id: "std-15644-c2",
        number: "9.2",
        title: "Heating and accessible surface temperature",
        text:
          "Under normal operation the temperature rise of accessible metal surfaces shall not exceed 25 K and of accessible plastic surfaces 45 K above an ambient of 25 degree C. Handles and grips intended to be held continuously shall be limited to a rise of 20 K for metal. Heating elements incorporated for a functional purpose shall be guarded from direct contact.",
        page: 12,
      },
      {
        id: "std-15644-c3",
        number: "12.1",
        title: "Batteries and battery compartments",
        text:
          "Battery compartments for toys intended for children under 36 months shall require a tool to open, or shall need two independent simultaneous movements to release. Terminals shall be arranged so that batteries cannot be inserted in a manner that causes a short circuit or reverse charging. Non-rechargeable cells shall be prevented from being recharged by circuit design.",
        page: 19,
      },
    ],
    relatedIds: ["std-9873-1", "std-9873-3", "std-16046-2"],
  },
  {
    id: "std-4151",
    number: "IS 4151:2015",
    year: 2015,
    title: "Protective Helmets for Two Wheeler Motor Vehicle Riders — Specification",
    sector: "PPE and Personal Safety",
    scope:
      "Specifies construction, shock absorption, penetration resistance and retention system requirements for protective helmets worn by riders and pillion passengers of two wheeled motor vehicles in India.",
    keywords: [
      "helmet",
      "two wheeler",
      "bike helmet",
      "motorcycle",
      "scooter",
      "isi helmet",
      "rider safety",
      "chin strap",
      "visor",
      "full face",
    ],
    status: "active",
    qcoId: "qco-helmets",
    schemeId: "scheme-i",
    tests: [
      "Shock absorption on flat and hemispherical anvils",
      "Penetration resistance with striker",
      "Retention system strength and dynamic test",
      "Roll-off (dynamic retention) test",
      "Peripheral vision measurement",
      "Visor optical quality and impact test",
    ],
    clauses: [
      {
        id: "std-4151-c1",
        number: "5.1",
        title: "Mass of the helmet",
        text:
          "The mass of a full face helmet including all fittings and the visor shall not exceed 1 200 g and that of an open face helmet shall not exceed 1 000 g. Mass is determined on a helmet of the largest size in the declared size range. Helmets exceeding these limits shall not be granted a licence irrespective of impact performance.",
        page: 6,
      },
      {
        id: "std-4151-c2",
        number: "6.2",
        title: "Shock absorption",
        text:
          "When a conditioned helmet mounted on the appropriate headform is dropped so that the impact velocity on a flat anvil is 7.0 +/- 0.1 m/s, the peak acceleration transmitted to the headform shall not exceed 300 g. The resultant acceleration shall not exceed 150 g for a cumulative duration of more than 4.0 ms. Tests are repeated at four impact sites after conditioning at high temperature, low temperature and after water immersion.",
        page: 11,
      },
      {
        id: "std-4151-c3",
        number: "6.5",
        title: "Retention system",
        text:
          "The chin strap and its fastening shall withstand a dynamic load applied through a 10 kg falling mass without the strap breaking or the extension exceeding 35 mm. Quick release buckles shall remain closed under the test load and shall open with a single hand movement afterwards. The strap shall be not less than 20 mm wide over the portion bearing on the jaw.",
        page: 16,
      },
      {
        id: "std-4151-c4",
        number: "9.1",
        title: "Marking and labelling",
        text:
          "Every helmet shall carry a permanently attached label stating the manufacturer name, model, size, month and year of manufacture, and the words for use by two wheeler riders only. The Standard Mark with the licence number shall be applied where the helmet is covered by a licence granted by the Bureau. A caution against modification of the shell or removal of the liner shall be printed on the label.",
        page: 24,
      },
    ],
    relatedIds: ["std-14887", "std-15298-2"],
  },
  {
    id: "std-14887",
    number: "IS 14887:2002",
    year: 2002,
    title: "Protective Helmets for Scooter and Motorcycle Riders — Specification",
    sector: "PPE and Personal Safety",
    scope:
      "Earlier specification for protective helmets for riders of scooters and motorcycles, covering shell material, shock absorbing liner and retention system. Retained for reference to legacy licences and older stock.",
    keywords: [
      "helmet",
      "motorcycle helmet",
      "scooter",
      "old helmet standard",
      "two wheeler",
      "rider",
      "head protection",
    ],
    status: "superseded",
    supersededBy: "IS 4151:2015",
    qcoId: "qco-helmets",
    schemeId: "scheme-i",
    tests: [
      "Shock absorption test",
      "Penetration test",
      "Retention system strength test",
      "Rigidity of the shell",
      "Field of vision check",
    ],
    clauses: [
      {
        id: "std-14887-c1",
        number: "5.2",
        title: "Shell and liner construction",
        text:
          "The shell shall be of a thermoplastic or thermoset composite of uniform thickness and shall be lined with an energy absorbing material of expanded polystyrene or equivalent. The comfort padding shall be separable from the energy absorbing liner for cleaning. Materials shall not be appreciably affected by exposure to sunlight, rain, cold, dust or vibration.",
        page: 5,
      },
      {
        id: "std-14887-c2",
        number: "7.1",
        title: "Transition to the revised standard",
        text:
          "Helmets manufactured against this specification are superseded by IS 4151:2015, which raises the shock absorption and retention requirements. Licences issued against this number were converted at renewal. Stock bearing this number should be checked against the licence validity before sale.",
        page: 15,
      },
      {
        id: "std-14887-c3",
        number: "6.3",
        title: "Field of vision",
        text:
          "The helmet when worn on the appropriate headform shall permit a horizontal peripheral vision of at least 105 degrees on each side of the median plane. The upward vision shall be at least 7 degrees and downward vision at least 45 degrees. Measurements are made with the reference plane of the headform horizontal.",
        page: 11,
      },
    ],
    relatedIds: ["std-4151"],
  },
  {
    id: "std-15298-2",
    number: "IS 15298 (Part 2):2016",
    year: 2016,
    title: "Personal Protective Equipment — Part 2 Safety Footwear",
    sector: "Footwear and Leather",
    scope:
      "Specifies basic and additional requirements for safety footwear incorporating protective toecaps designed to give protection against impact of at least 200 J and compression of at least 15 kN, for industrial and construction use.",
    keywords: [
      "safety shoes",
      "safety footwear",
      "steel toe",
      "industrial shoes",
      "boots",
      "ppe",
      "footwear",
      "protective toecap",
      "shoe",
    ],
    status: "active",
    qcoId: "qco-footwear",
    schemeId: "scheme-i",
    tests: [
      "Toecap impact test at 200 J",
      "Toecap compression test at 15 kN",
      "Slip resistance on ceramic tile with detergent",
      "Penetration resistance of the sole",
      "Upper and outsole bond strength",
      "Antistatic resistance measurement",
    ],
    clauses: [
      {
        id: "std-15298-2-c1",
        number: "5.3",
        title: "Impact resistance of the toecap",
        text:
          "The toecap shall withstand an impact energy of 200 +/- 4 J applied by a striker with a wedge-shaped face, after which the internal clearance under the toecap shall be not less than 14.0 mm for size 42. No crack shall pass through the toecap material such that light is visible. Testing is carried out on complete footwear conditioned at 23 +/- 2 degree C.",
        page: 8,
      },
      {
        id: "std-15298-2-c2",
        number: "6.2",
        title: "Slip resistance",
        text:
          "Footwear marked SRA shall achieve a coefficient of friction of at least 0.32 for forward heel slip and 0.28 for forward flat slip on a ceramic tile floor with sodium lauryl sulphate solution. Footwear marked SRB is tested on a steel floor with glycerol. Marking SRC requires compliance with both conditions.",
        page: 15,
      },
      {
        id: "std-15298-2-c3",
        number: "6.5",
        title: "Penetration resistance",
        text:
          "Where penetration resistance is claimed, the insert shall resist a force of not less than 1 100 N applied through a truncated nail of 4.5 mm diameter. The insert shall not be removable without damaging the footwear and shall cover the maximum possible area of the insole. The residual gap after penetration testing shall be recorded in the report.",
        page: 19,
      },
      {
        id: "std-15298-2-c4",
        number: "9.1",
        title: "Marking of footwear",
        text:
          "Each item of footwear shall be durably marked with the size, the manufacturer identification, the year and quarter of manufacture, the number of this standard and the category symbol such as S1, S1P or S3. Additional protection symbols such as P for penetration resistance, A for antistatic and HRO for heat resistant outsole shall follow the category. The information notice supplied with the footwear shall explain each symbol.",
        page: 27,
      },
    ],
    relatedIds: ["std-6721", "std-4151"],
  },
  {
    id: "std-6721",
    number: "IS 6721:1972",
    year: 1972,
    title: "Rubber Hawai Chappal — Specification",
    sector: "Footwear and Leather",
    scope:
      "Covers requirements for rubber hawai chappals, the moulded expanded-rubber slippers in wide domestic use, including sole thickness, strap retention and abrasion performance.",
    keywords: [
      "chappal",
      "slipper",
      "hawai chappal",
      "rubber slipper",
      "footwear",
      "sandal",
      "flip flop",
      "shoe",
    ],
    status: "active",
    qcoId: "qco-footwear",
    schemeId: "scheme-i",
    tests: [
      "Strap pull-out (retention) test",
      "Abrasion resistance of the sole",
      "Density and hardness of expanded rubber",
      "Dimensional check against size chart",
      "Flexing endurance test",
    ],
    clauses: [
      {
        id: "std-6721-c1",
        number: "4.2",
        title: "Sole material and thickness",
        text:
          "The sole shall be made of expanded natural or synthetic rubber of density between 0.20 and 0.45 g/cm3, free from cracks, blisters and embedded foreign matter. The thickness at the heel region shall be not less than 12 mm for adult sizes and not less than 9 mm for children sizes. The upper surface shall be textured to reduce slipping when wet.",
        page: 3,
      },
      {
        id: "std-6721-c2",
        number: "5.1",
        title: "Strap retention",
        text:
          "When a straight pull is applied to the strap at the toe post, the strap shall not pull out of the sole at a load below 100 N for adult sizes. The test is repeated at each of the three anchorage points. Tearing of the sole around the anchorage constitutes a failure even if the strap itself remains intact.",
        page: 5,
      },
      {
        id: "std-6721-c3",
        number: "5.3",
        title: "Abrasion resistance",
        text:
          "The volume loss when tested on an abrasion machine under a load of 5 N over a distance of 40 m shall not exceed 500 mm3. Two specimens shall be taken from the heel region of different chappals. Results are reported to the nearest 10 mm3.",
        page: 6,
      },
    ],
    relatedIds: ["std-15298-2"],
  },
  {
    id: "std-16046-2",
    number: "IS 16046 (Part 2):2018",
    year: 2018,
    title:
      "Secondary Cells and Batteries Containing Alkaline or Other Non-acid Electrolytes — Safety Requirements for Portable Sealed Secondary Lithium Cells Part 2 Batteries",
    sector: "Batteries and E-Mobility",
    scope:
      "Specifies safety requirements and tests for portable sealed lithium-ion and lithium-polymer battery packs used in mobile phones, laptops, power banks, power tools and light electric vehicles. Addresses electrical, mechanical and thermal abuse conditions.",
    keywords: [
      "lithium ion",
      "battery",
      "li-ion",
      "power bank",
      "battery pack",
      "cell",
      "ev battery",
      "charging",
      "thermal runaway",
      "mobile battery",
      "lithium",
    ],
    status: "active",
    qcoId: "qco-batteries",
    schemeId: "scheme-ii",
    tests: [
      "External short circuit test at 20 and 55 degree C",
      "Overcharge and forced discharge test",
      "Crush and impact test on cells",
      "Thermal abuse test at 130 degree C",
      "Vibration and mechanical shock test",
      "Altitude simulation at low pressure",
    ],
    clauses: [
      {
        id: "std-16046-2-c1",
        number: "7.2",
        title: "Battery management and protection circuit",
        text:
          "Every battery pack shall incorporate a protection circuit that limits charging voltage, charging current, discharge current and cell temperature to within the cell manufacturer specified operating region. The protection shall operate under single-fault conditions of the charging system. Documentation of the protection thresholds shall accompany the sample submitted for testing.",
        page: 17,
      },
      {
        id: "std-16046-2-c2",
        number: "8.3",
        title: "External short circuit",
        text:
          "A fully charged battery is short circuited through a resistance of 80 +/- 20 milliohm at an ambient of 20 +/- 5 degree C and again at 55 +/- 5 degree C. The battery shall not catch fire and shall not explode, and the external temperature shall not exceed 150 degree C. The test continues until the current falls below 10 percent of the peak or for 24 h, whichever is earlier.",
        page: 21,
      },
      {
        id: "std-16046-2-c3",
        number: "8.6",
        title: "Thermal abuse",
        text:
          "Cells are placed in a gravity convection oven, the temperature is raised at 5 +/- 2 K per minute to 130 +/- 2 degree C and held for 30 min. Cells shall not explode or catch fire during the test or during the subsequent cooling to ambient. Venting of the safety device without ignition is acceptable.",
        page: 25,
      },
      {
        id: "std-16046-2-c4",
        number: "10.1",
        title: "Marking and user information",
        text:
          "Battery packs shall be marked with the nominal voltage, rated capacity in Wh or mAh, chemistry, manufacturer identification and date of manufacture. Warnings against disassembly, incineration, immersion and use of unapproved chargers shall be included in the user documentation. Packs registered under the Compulsory Registration Scheme shall carry the registration number.",
        page: 33,
      },
    ],
    relatedIds: ["std-17017-1", "std-13252-1", "std-16333-3"],
  },
  {
    id: "std-17017-1",
    number: "IS 17017 (Part 1):2018",
    year: 2018,
    title: "Electric Vehicle Conductive Charging System — Part 1 General Requirements",
    sector: "Batteries and E-Mobility",
    scope:
      "Specifies general requirements for conductive charging systems for electric vehicles, covering charging modes, connector types, protection against electric shock and communication between the vehicle and the supply equipment.",
    keywords: [
      "ev charger",
      "charging station",
      "electric vehicle",
      "ev",
      "charger",
      "connector",
      "ac charging",
      "dc fast charging",
      "e-scooter",
      "evse",
    ],
    status: "active",
    qcoId: "qco-batteries",
    schemeId: "scheme-i",
    tests: [
      "Protective conductor continuity and earth resistance",
      "Insulation resistance and dielectric withstand",
      "Control pilot signal verification",
      "Temperature rise of connectors under rated current",
      "Ingress protection (IP) rating test",
      "Residual current device operation test",
    ],
    clauses: [
      {
        id: "std-17017-1-c1",
        number: "6.2",
        title: "Charging modes",
        text:
          "Mode 1 charging without a control pilot conductor shall not be used for public charging installations in India. Mode 2 and Mode 3 charging shall include a control pilot function and a protective earth continuity check before energising the vehicle coupler. Mode 4 covers direct current supply from off-board charging equipment with digital communication.",
        page: 14,
      },
      {
        id: "std-17017-1-c2",
        number: "8.4",
        title: "Protection against electric shock",
        text:
          "Every charging point shall be protected by a residual current device with a rated residual operating current not exceeding 30 mA. Where the equipment can supply direct current fault currents, protection against d.c. residual current of 6 mA shall be provided. Live parts of the vehicle connector shall not be accessible when the connector is not fully mated.",
        page: 22,
      },
      {
        id: "std-17017-1-c3",
        number: "9.1",
        title: "Connector and inlet requirements",
        text:
          "Vehicle couplers shall withstand 10 000 mating cycles without exceeding the specified contact resistance. The temperature rise of the contacts at rated current shall not exceed 50 K. Connectors installed outdoors shall achieve at least IP54 when mated and IP24 when unmated with the protective cap fitted.",
        page: 27,
      },
      {
        id: "std-17017-1-c4",
        number: "11.2",
        title: "Marking of charging equipment",
        text:
          "Charging equipment shall be marked with the rated voltage, rated current, number of phases, frequency, charging mode and the applicable connector type. An indelible label shall state the manufacturer name, model and serial number. Instructions for emergency disconnection shall be displayed at the charging point in Hindi and English.",
        page: 34,
      },
    ],
    relatedIds: ["std-16046-2", "std-694", "std-1293"],
  },
  {
    id: "std-694",
    number: "IS 694:2010",
    year: 2010,
    title:
      "Polyvinyl Chloride Insulated Unsheathed and Sheathed Cables and Cords with Rigid and Flexible Conductor — Specification",
    sector: "Electrical Accessories",
    scope:
      "Covers PVC insulated cables and flexible cords for working voltages up to and including 1 100 V, used in house wiring, appliance connection and panel wiring. Specifies conductor construction, insulation thickness and electrical performance.",
    keywords: [
      "wire",
      "cable",
      "house wiring",
      "pvc cable",
      "flexible cord",
      "electrical wire",
      "copper wire",
      "wiring",
      "conductor",
    ],
    status: "active",
    qcoId: "qco-appliances",
    schemeId: "scheme-i",
    tests: [
      "Conductor resistance at 20 degree C",
      "Insulation resistance measurement",
      "High voltage (water immersion) test",
      "Tensile strength and elongation of insulation before and after ageing",
      "Flammability test on single cable",
      "Insulation thickness measurement",
    ],
    clauses: [
      {
        id: "std-694-c1",
        number: "5.1",
        title: "Conductor construction",
        text:
          "Conductors shall be of plain or tinned annealed copper, or of aluminium where specifically ordered, complying with the class specified in IS 8130. The number and diameter of wires shall be such that the maximum conductor resistance in Table 2 is not exceeded. Joints in individual wires are permitted only during the drawing operation and not in the finished cable.",
        page: 5,
      },
      {
        id: "std-694-c2",
        number: "6.2",
        title: "Insulation thickness",
        text:
          "The average thickness of insulation shall not be less than the nominal value in Table 4 and the minimum measured value at any point shall not fall below 90 percent of the nominal thickness minus 0.1 mm. Measurements are made on a sample from each drum. Eccentricity of the insulation shall not exceed the limits of 6.3.",
        page: 8,
      },
      {
        id: "std-694-c3",
        number: "13.3",
        title: "Flammability",
        text:
          "A 600 mm length of finished cable mounted vertically and subjected to the flame of the specified burner for 60 s shall self-extinguish, and the charred portion shall not extend more than 50 mm below the lower edge of the top clamp. Cables declared as flame retardant low smoke shall additionally satisfy the smoke density and acid gas requirements of Annex F. Test results shall record the ambient temperature and draught conditions.",
        page: 21,
      },
      {
        id: "std-694-c4",
        number: "16.1",
        title: "Marking and identification",
        text:
          "Cables shall be marked along the length at intervals not exceeding 1 m with the manufacturer name or trade-mark, the voltage grade and the year of manufacture. Core identification shall follow the colour scheme of Table 6, with green-yellow reserved exclusively for the protective conductor. The Standard Mark, where applied, shall be embossed or printed on the sheath.",
        page: 26,
      },
    ],
    relatedIds: ["std-1293", "std-302-1", "std-17017-1"],
  },
  {
    id: "std-1293",
    number: "IS 1293:2019",
    year: 2019,
    title:
      "Plugs and Socket-Outlets of Rated Voltage up to and including 250 V and Rated Current up to and including 16 A — Specification",
    sector: "Electrical Accessories",
    scope:
      "Specifies requirements for two-pole and three-pole plugs, socket-outlets and multi-plug adaptors for household and similar use, including shuttered sockets and combination units used in extension boards.",
    keywords: [
      "plug",
      "socket",
      "switch board",
      "extension board",
      "adaptor",
      "power socket",
      "electrical accessory",
      "6a socket",
      "16a socket",
    ],
    status: "active",
    qcoId: "qco-appliances",
    schemeId: "scheme-i",
    tests: [
      "Temperature rise at rated current",
      "Breaking capacity and normal operation endurance",
      "Resistance to ageing, humidity and tracking",
      "Pull-out force of plug from socket",
      "Glow wire and ball pressure tests",
      "Protection against electric shock with test probe",
    ],
    clauses: [
      {
        id: "std-1293-c1",
        number: "10.1",
        title: "Protection against electric shock",
        text:
          "Socket-outlets shall be constructed so that live parts are not accessible with the standard test finger when the socket is wired and mounted as in normal use. Sockets rated 6 A and above shall be fitted with shutters that prevent access to the line and neutral contacts unless a plug is inserted. The shutter shall not be openable by a single probe applied to one aperture.",
        page: 22,
      },
      {
        id: "std-1293-c2",
        number: "16.2",
        title: "Temperature rise",
        text:
          "When carrying rated current for one hour, the temperature rise of terminals shall not exceed 45 K and that of accessible external surfaces of insulating material shall not exceed 40 K. The test is performed with the accessory mounted in the manner declared by the manufacturer. Conductors of the cross-section given in Table 6 shall be used for the test.",
        page: 33,
      },
      {
        id: "std-1293-c3",
        number: "24.1",
        title: "Resistance to heat and fire",
        text:
          "Parts of insulating material retaining live parts in position shall withstand a glow wire test at 850 degree C, and other parts of insulating material at 650 degree C. The ball pressure test shall be conducted at 125 degree C for parts retaining current-carrying parts and at 75 degree C for other parts. The impression diameter after the ball pressure test shall not exceed 2 mm.",
        page: 48,
      },
      {
        id: "std-1293-c4",
        number: "8.1",
        title: "Marking",
        text:
          "Each accessory shall be marked with rated current, rated voltage, symbol for the nature of supply, manufacturer name or trade-mark and type reference. Markings shall be durable and readily legible after being rubbed for 15 s with a cloth soaked in water and then with a cloth soaked in petroleum spirit. Terminal identification shall distinguish line, neutral and earth.",
        page: 18,
      },
    ],
    relatedIds: ["std-694", "std-302-1"],
  },
  {
    id: "std-4246",
    number: "IS 4246:2002",
    year: 2002,
    title: "Domestic Gas Stoves for Use with Liquefied Petroleum Gases — Specification",
    sector: "Household Appliances",
    scope:
      "Specifies requirements for domestic gas stoves with one to four burners for use with liquefied petroleum gas, covering burner performance, thermal efficiency, gas soundness and safety of the pan supports.",
    keywords: [
      "gas stove",
      "lpg stove",
      "chulha",
      "burner",
      "cooktop",
      "hob",
      "kitchen appliance",
      "cooking",
      "household",
    ],
    status: "active",
    qcoId: "qco-appliances",
    schemeId: "scheme-i",
    tests: [
      "Thermal efficiency of each burner",
      "Gas soundness (leak) test at 1.5 times working pressure",
      "Flame stability — lift, flash-back and yellow tipping",
      "Carbon monoxide content in dry flue products",
      "Stability of the stove on an inclined surface",
      "Durability of the burner after 5 000 ignition cycles",
    ],
    clauses: [
      {
        id: "std-4246-c1",
        number: "6.1",
        title: "Thermal efficiency",
        text:
          "The thermal efficiency of each burner determined by the water heating method shall not be less than 68 percent for a stove with a single burner and not less than 66 percent for multi-burner stoves. Testing is carried out at a nominal supply pressure of 2.75 kPa using commercial LPG. The value reported is the mean of three consecutive determinations differing by not more than 1 percent.",
        page: 8,
      },
      {
        id: "std-4246-c2",
        number: "7.2",
        title: "Gas soundness",
        text:
          "The complete gas circuit from the inlet to the burner injectors, with the taps closed, shall show a leakage not exceeding 0.07 dm3/h when tested with air at 4.5 kPa. With the taps open the leakage past the tap spindle shall not exceed 0.07 dm3/h. The test shall be repeated after the endurance test of 9.3.",
        page: 11,
      },
      {
        id: "std-4246-c3",
        number: "6.4",
        title: "Combustion quality",
        text:
          "The carbon monoxide content of the dry, air-free products of combustion shall not exceed 0.10 percent by volume under normal test conditions and 0.20 percent under limit conditions. Flames shall not lift from the burner ports nor flash back when the burner is turned from full to minimum rate. Yellow tipping shall not extend more than 20 mm from the flame cone.",
        page: 9,
      },
      {
        id: "std-4246-c4",
        number: "11.1",
        title: "Marking and instructions",
        text:
          "The stove shall be marked with the manufacturer name or trade-mark, model, number of burners, the type of gas, the nominal gas pressure and the year of manufacture. An instruction sheet in Hindi and English shall cover installation clearances, safe lighting procedure, cleaning of burner ports and the action to take on smelling gas. The Standard Mark shall be applied only under a valid licence.",
        page: 19,
      },
    ],
    relatedIds: ["std-2347", "std-15111-1", "std-302-1"],
  },
  {
    id: "std-2347",
    number: "IS 2347:2017",
    year: 2017,
    title: "Household Pressure Cookers — Specification",
    sector: "Household Appliances",
    scope:
      "Specifies requirements for aluminium household pressure cookers of the inner-lid and outer-lid types, covering wall thickness, safety devices, gasket performance and pressure endurance.",
    keywords: [
      "pressure cooker",
      "cooker",
      "aluminium cooker",
      "kitchen",
      "gasket",
      "safety valve",
      "cookware",
      "household",
      "whistle",
    ],
    status: "active",
    qcoId: "qco-appliances",
    schemeId: "scheme-i",
    tests: [
      "Hydraulic pressure test at three times operating pressure",
      "Operation of the safety fusible plug or relief device",
      "Endurance test of 3 000 pressure cycles",
      "Gasket compression set and ageing",
      "Handle strength and heat resistance",
      "Wall and base thickness measurement",
    ],
    clauses: [
      {
        id: "std-2347-c1",
        number: "5.2",
        title: "Body material and thickness",
        text:
          "The body shall be manufactured from aluminium or aluminium alloy of not less than 99.0 percent purity in the case of commercially pure aluminium, free from porosity and inclusions. The minimum wall thickness shall be 2.5 mm and the minimum base thickness 3.5 mm for capacities up to 5 litres. Anodised or hard-anodised finishes shall be uniform and free from bare patches on food contact surfaces.",
        page: 6,
      },
      {
        id: "std-2347-c2",
        number: "7.1",
        title: "Safety devices",
        text:
          "Every pressure cooker shall be fitted with at least two independent pressure limiting devices, one of which shall be a non-adjustable safety device that operates without requiring the user to act. The safety device shall release pressure before it reaches three times the rated operating pressure. Devices shall be so placed that escaping steam is directed away from the user.",
        page: 12,
      },
      {
        id: "std-2347-c3",
        number: "8.3",
        title: "Endurance under pressure cycling",
        text:
          "The cooker shall withstand 3 000 cycles of pressurising to the rated operating pressure and returning to atmospheric pressure without permanent distortion, cracking or loss of seal. The gasket may be replaced once during the test at the interval declared by the manufacturer. After the test the cooker shall pass the hydraulic pressure test of 8.1.",
        page: 15,
      },
      {
        id: "std-2347-c4",
        number: "12.1",
        title: "Marking and user warnings",
        text:
          "Each cooker shall be permanently marked with the manufacturer name or trade-mark, capacity in litres, rated operating pressure in kPa, batch number and year of manufacture. The instruction booklet shall warn against opening the lid before pressure has fully dropped and against filling beyond two-thirds of the capacity. Genuine replacement gasket and safety valve part numbers shall be listed.",
        page: 24,
      },
    ],
    relatedIds: ["std-15111-1", "std-14756", "std-4246"],
  },
  {
    id: "std-15111-1",
    number: "IS 15111 (Part 1):2020",
    year: 2020,
    title: "Stainless Steel Pressure Cookers — Part 1 Specification",
    sector: "Household Appliances",
    scope:
      "Specifies requirements for stainless steel household pressure cookers, including sandwich-bottom and induction-compatible constructions, covering material grade, safety devices and pressure endurance.",
    keywords: [
      "pressure cooker",
      "stainless steel cooker",
      "induction cooker",
      "cookware",
      "kitchen",
      "safety valve",
      "gasket",
      "household",
      "steel cooker",
    ],
    status: "active",
    qcoId: "qco-appliances",
    schemeId: "scheme-i",
    tests: [
      "Hydraulic pressure test at three times operating pressure",
      "Safety device release pressure verification",
      "Sandwich base bond integrity after thermal cycling",
      "Endurance test of 3 000 pressure cycles",
      "Migration test on food contact surfaces",
      "Handle pull and torque test",
    ],
    clauses: [
      {
        id: "std-15111-1-c1",
        number: "4.1",
        title: "Material of construction",
        text:
          "The body and lid shall be fabricated from austenitic stainless steel of grade 304 conforming to IS 6911, with a minimum thickness of 0.8 mm for the body wall. Encapsulated bases may incorporate an aluminium or copper core clad with magnetic stainless steel for induction compatibility. The cladding shall not delaminate after 500 thermal cycles between 25 degree C and 250 degree C.",
        page: 5,
      },
      {
        id: "std-15111-1-c2",
        number: "6.2",
        title: "Pressure limiting devices",
        text:
          "Two independent pressure limiting devices shall be provided, at least one being non-resettable or self-acting without user intervention. The primary device shall maintain the operating pressure within plus or minus 15 percent of the rated value. The secondary device shall operate before the pressure reaches 2.5 times the rated operating pressure.",
        page: 11,
      },
      {
        id: "std-15111-1-c3",
        number: "7.4",
        title: "Lid locking and interlock",
        text:
          "The cooker shall incorporate an interlock that prevents the lid from being opened while the internal pressure exceeds 4 kPa above atmospheric. It shall also prevent pressure from building up if the lid is not correctly closed. The interlock shall remain functional after the endurance test of 8.2.",
        page: 14,
      },
      {
        id: "std-15111-1-c4",
        number: "10.1",
        title: "Marking",
        text:
          "Each cooker shall carry a permanent marking of the manufacturer name or trade-mark, nominal capacity, rated operating pressure, stainless steel grade, batch number and month and year of manufacture. Where a licence has been granted, the Standard Mark shall be applied together with the licence number. Induction compatibility shall be indicated by the appropriate symbol.",
        page: 21,
      },
    ],
    relatedIds: ["std-2347", "std-14756", "std-17803"],
  },
  {
    id: "std-16102-1",
    number: "IS 16102 (Part 1):2012",
    year: 2012,
    title:
      "Self-Ballasted LED Lamps for General Lighting Services — Part 1 Safety Requirements",
    sector: "Electronics and IT",
    scope:
      "Specifies safety requirements for self-ballasted LED lamps with integrated control gear intended for domestic and general lighting at supply voltages up to 250 V, including bulbs with B22 and E27 caps.",
    keywords: [
      "led bulb",
      "led lamp",
      "bulb",
      "lighting",
      "light",
      "b22",
      "e27",
      "lamp",
      "electronics",
      "crs",
    ],
    status: "active",
    qcoId: "qco-electronics",
    schemeId: "scheme-ii",
    tests: [
      "Insulation resistance and electric strength",
      "Torque test on the lamp cap",
      "Accidental contact protection test",
      "Resistance to heat and to flame (needle flame)",
      "Fault condition and abnormal operation test",
      "Marking legibility and durability test",
    ],
    clauses: [
      {
        id: "std-16102-1-c1",
        number: "7.1",
        title: "Protection against accidental contact",
        text:
          "Lamps shall be constructed so that when fitted into a lampholder of the appropriate type, live parts are not accessible to the standard test finger or the test pin. This applies both during insertion and after the lamp is fully seated. Metal parts of the cap other than the contacts shall not become live under any fault condition.",
        page: 8,
      },
      {
        id: "std-16102-1-c2",
        number: "8.2",
        title: "Insulation resistance and electric strength",
        text:
          "After humidity treatment for 48 h at 91 to 95 percent relative humidity, the insulation resistance between current-carrying parts and accessible metal parts shall be not less than 4 megohm. The insulation shall then withstand 4 000 V for 1 min without breakdown for double insulated constructions. No flashover or puncture shall occur.",
        page: 11,
      },
      {
        id: "std-16102-1-c3",
        number: "11.1",
        title: "Resistance to flame and ignition",
        text:
          "Parts of insulating material that could be exposed to thermal stress due to electrical effects shall withstand the needle flame test for 10 s without sustaining flame for more than 30 s after removal of the burner. Any burning drips shall not ignite the tissue paper placed below the specimen. Parts of ceramic material are exempt.",
        page: 16,
      },
      {
        id: "std-16102-1-c4",
        number: "5.1",
        title: "Marking on the lamp",
        text:
          "Lamps shall be legibly marked with the mark of origin, rated voltage or voltage range, rated wattage and rated frequency. The packaging shall additionally declare the luminous flux, correlated colour temperature and rated life in hours. Products under the Compulsory Registration Scheme shall carry the registration number in the format prescribed by the Bureau.",
        page: 6,
      },
    ],
    relatedIds: ["std-16333-3", "std-13252-1", "std-16058"],
  },
  {
    id: "std-16058",
    number: "IS 16058:2019",
    year: 2019,
    title:
      "Household Electrical Storage Water Heaters — Energy Performance and Star Labelling Requirements",
    sector: "Household Appliances",
    scope:
      "Specifies methods for measuring standing loss and thermal efficiency of household electrical storage water heaters, commonly called geysers, and the corresponding star rating bands used for energy labelling.",
    keywords: [
      "geyser",
      "water heater",
      "storage water heater",
      "star rating",
      "energy efficiency",
      "bathroom",
      "household",
      "appliance",
      "heater",
    ],
    status: "active",
    qcoId: "qco-appliances",
    schemeId: "scheme-i",
    tests: [
      "Standing loss measurement over 24 hours",
      "Thermal efficiency determination",
      "Thermostat set-point accuracy and cut-out repeatability",
      "Water-side pressure and leakage test",
      "Insulation resistance and earth continuity",
    ],
    clauses: [
      {
        id: "std-16058-c1",
        number: "5.2",
        title: "Standing loss determination",
        text:
          "The heater is filled, brought to a stabilised mean water temperature of 65 +/- 2 degree C above an ambient of 25 +/- 2 degree C and left under thermostatic control with no water draw for 24 h. The electrical energy consumed over the period, expressed in kWh per 24 h, is reported as the standing loss. Two consecutive determinations shall not differ by more than 5 percent.",
        page: 9,
      },
      {
        id: "std-16058-c2",
        number: "6.1",
        title: "Star rating bands",
        text:
          "Star ratings from one to five are assigned on the basis of the measured standing loss corrected for the rated storage volume, using the bands in Table 2. A heater whose standing loss exceeds the one-star limit shall not be labelled. Ratings shall be re-established whenever the insulation thickness, tank geometry or thermostat setting changes.",
        page: 12,
      },
      {
        id: "std-16058-c3",
        number: "7.3",
        title: "Thermostat and thermal cut-out",
        text:
          "The thermostat shall maintain the set water temperature within plus or minus 5 K of the declared value over ten consecutive operating cycles. An independent non-self-resetting thermal cut-out shall interrupt the supply before the water temperature exceeds 85 degree C. Both devices shall be tested after the endurance test of 8.1.",
        page: 15,
      },
    ],
    relatedIds: ["std-302-1", "std-16102-1"],
  },
  {
    id: "std-17262",
    number: "IS 17262:2019",
    year: 2019,
    title: "Textiles — Polyester Continuous Filament Fully Drawn Yarn — Specification",
    sector: "Textiles",
    scope:
      "Specifies requirements for polyester continuous filament fully drawn yarn used for weaving and knitting of apparel and home textile fabrics, covering linear density, tenacity, elongation, dyeability and oil pick-up.",
    keywords: [
      "polyester yarn",
      "yarn",
      "textile",
      "fdy",
      "fabric",
      "filament",
      "weaving",
      "knitting",
      "cloth",
      "spinning",
    ],
    status: "active",
    qcoId: "qco-textiles",
    schemeId: "scheme-i",
    tests: [
      "Linear density (denier) determination",
      "Tenacity and breaking elongation on tensile tester",
      "Oil pick-up by solvent extraction",
      "Dye uptake uniformity on knitted tube",
      "Boiling water shrinkage",
      "Moisture regain measurement",
    ],
    clauses: [
      {
        id: "std-17262-c1",
        number: "5.1",
        title: "Linear density tolerance",
        text:
          "The linear density of the yarn shall not deviate from the nominal declared value by more than plus or minus 2.0 percent when determined on a skein of 100 m in accordance with IS 7703 (Part 1). Ten determinations shall be made from different packages in the lot. The coefficient of variation of linear density within the lot shall not exceed 1.5 percent.",
        page: 5,
      },
      {
        id: "std-17262-c2",
        number: "5.3",
        title: "Tenacity and elongation",
        text:
          "The mean tenacity shall be not less than 4.0 cN/dtex and the breaking elongation shall lie between 20 and 45 percent for normal tenacity yarn. Twenty tests are conducted at a gauge length of 500 mm and an extension rate of 500 mm per minute. Results shall be reported at standard atmospheric conditions of 27 +/- 2 degree C and 65 +/- 2 percent relative humidity.",
        page: 7,
      },
      {
        id: "std-17262-c3",
        number: "6.2",
        title: "Freedom from harmful substances",
        text:
          "The yarn and any spin finish applied to it shall not contain azo colourants that release any of the restricted aromatic amines listed in IS 15570 beyond 30 mg/kg. Heavy metal content shall be within the limits of Table 4. A declaration of the spin finish composition shall be available for inspection.",
        page: 10,
      },
      {
        id: "std-17262-c4",
        number: "9.1",
        title: "Packing and marking",
        text:
          "Each package shall bear a label giving the manufacturer name, lot number, nominal linear density, number of filaments, lustre, merge number and net mass. Packages within a consignment shall be of the same merge unless otherwise agreed. The Standard Mark, where applicable, shall be applied to the package label and the outer carton.",
        page: 14,
      },
    ],
    relatedIds: ["std-15570", "std-17621"],
  },
  {
    id: "std-15570",
    number: "IS 15570:2005",
    year: 2005,
    title:
      "Textiles — Methods for Determination of Certain Aromatic Amines Derived from Azo Colourants",
    sector: "Textiles",
    scope:
      "Prescribes the analytical methods for detecting aromatic amines released by the reductive cleavage of azo colourants in textile and leather articles, used to verify freedom from banned azo dyes.",
    keywords: [
      "azo dye",
      "textile testing",
      "banned dye",
      "aromatic amine",
      "fabric",
      "garment",
      "leather",
      "chemical test",
      "cloth",
    ],
    status: "active",
    qcoId: "qco-textiles",
    schemeId: "scheme-i",
    tests: [
      "Reductive cleavage with sodium dithionite",
      "Extraction and concentration of amines",
      "Identification by gas chromatography mass spectrometry",
      "Confirmation by high performance liquid chromatography",
      "Recovery check with spiked control samples",
    ],
    clauses: [
      {
        id: "std-15570-c1",
        number: "4.1",
        title: "Scope of restricted amines",
        text:
          "The method covers the twenty-four aromatic amines listed in Annex A whose release from azo colourants is restricted in textiles that come into prolonged contact with human skin. A material is considered non-conforming if any listed amine is detected above 30 mg/kg. Detection below the limit of quantification shall be reported as not detected together with the limit achieved.",
        page: 3,
      },
      {
        id: "std-15570-c2",
        number: "6.3",
        title: "Reductive cleavage procedure",
        text:
          "The test specimen is treated with citrate buffer at pH 6.0 and heated to 70 +/- 2 degree C, after which freshly prepared sodium dithionite solution is added and the reduction allowed to proceed for 30 min. The mixture is cooled rapidly and the liberated amines are extracted onto a diatomaceous earth column with tert-butyl methyl ether. The extract is concentrated to a defined volume before instrumental analysis.",
        page: 7,
      },
      {
        id: "std-15570-c3",
        number: "8.1",
        title: "Reporting of results",
        text:
          "The test report shall identify each amine detected, the concentration in milligrams per kilogram of textile, the analytical technique used and the recovery obtained on the spiked control. Where the sample is composed of several colours or materials, each shall be analysed and reported separately. The report shall state that the result applies only to the sample as received.",
        page: 12,
      },
    ],
    relatedIds: ["std-17262", "std-9873-3"],
  },
  {
    id: "std-17621",
    number: "IS 17621:2021",
    year: 2021,
    title: "Textiles — Reusable Protective Face Covers — Specification",
    sector: "Textiles",
    scope:
      "Specifies requirements for reusable multi-layer textile face covers for use by the general public, covering particle filtration efficiency, breathability, wash durability and freedom from harmful substances.",
    keywords: [
      "face mask",
      "mask",
      "face cover",
      "textile",
      "filtration",
      "reusable mask",
      "cloth mask",
      "hygiene",
      "protective",
    ],
    status: "active",
    qcoId: "qco-medical-hygiene",
    schemeId: "scheme-i",
    tests: [
      "Particle filtration efficiency at 3 micron",
      "Differential pressure (breathability) measurement",
      "Wash durability over 15 laundering cycles",
      "Azo colourant and formaldehyde content check",
      "Dimensional stability after washing",
    ],
    clauses: [
      {
        id: "std-17621-c1",
        number: "5.1",
        title: "Filtration efficiency",
        text:
          "The particle filtration efficiency measured with a 3 micron aerosol at a face velocity of 5 cm/s shall be not less than 70 percent for class 1 and not less than 90 percent for class 2 face covers. The efficiency shall be maintained after the declared number of wash cycles, subject to a maximum drop of 10 percentage points. Testing shall be conducted on five specimens taken from different production units.",
        page: 6,
      },
      {
        id: "std-17621-c2",
        number: "5.3",
        title: "Breathability",
        text:
          "The differential pressure across the face cover shall not exceed 70 Pa/cm2 at an air flow of 8 litres per minute. Higher filtration classes shall still satisfy this limit so that the cover remains usable for extended periods. The measurement is made on an area of 4.9 cm2 in the central region of the cover.",
        page: 8,
      },
      {
        id: "std-17621-c3",
        number: "6.2",
        title: "Harmful substances",
        text:
          "Free and hydrolysed formaldehyde content shall not exceed 20 mg/kg for face covers in direct contact with skin. Azo colourants releasing restricted aromatic amines shall be absent when tested by IS 15570. Any antimicrobial finish applied shall be declared with its active substance and registration details.",
        page: 11,
      },
    ],
    relatedIds: ["std-15570", "std-5405", "std-17262"],
  },
  {
    id: "std-266",
    number: "IS 266:1993",
    year: 1993,
    title: "Sulphuric Acid — Specification",
    sector: "Chemicals and Petrochemicals",
    scope:
      "Specifies requirements for commercial, battery and technical grades of sulphuric acid used in industry, including limits on iron, arsenic, lead and residue on ignition, together with packing and handling requirements.",
    keywords: [
      "sulphuric acid",
      "acid",
      "chemical",
      "battery acid",
      "industrial chemical",
      "reagent",
      "corrosive",
      "h2so4",
    ],
    status: "active",
    qcoId: "qco-chemicals",
    schemeId: "scheme-i",
    tests: [
      "Total acidity by titration",
      "Iron content by spectrophotometry",
      "Arsenic content by Gutzeit method",
      "Residue on ignition",
      "Chloride and nitrate content",
      "Specific gravity at 27 degree C",
    ],
    clauses: [
      {
        id: "std-266-c1",
        number: "4.1",
        title: "Grades and strength",
        text:
          "Sulphuric acid is classified as commercial grade, battery grade and technical grade with minimum total acidity as sulphuric acid of 98.0, 98.0 and 95.0 percent by mass respectively. Battery grade shall additionally satisfy the stricter limits on iron, chloride and organic matter in Table 1. The grade shall be stated on the order and on the container label.",
        page: 3,
      },
      {
        id: "std-266-c2",
        number: "5.2",
        title: "Impurity limits for battery grade",
        text:
          "Battery grade acid shall contain not more than 0.005 percent iron as Fe, 0.0001 percent arsenic as As and 0.0005 percent lead as Pb by mass. Residue on ignition shall not exceed 0.02 percent and the acid shall be free from suspended matter. Materials failing any single limit shall be downgraded rather than reworked into the same lot.",
        page: 5,
      },
      {
        id: "std-266-c3",
        number: "8.1",
        title: "Packing, marking and handling",
        text:
          "The acid shall be supplied in rubber-lined or acid-resistant containers, drums or tankers that are clean and dry before filling. Each container shall be marked with the grade, net mass, batch number, manufacturer name and the corrosive hazard pictogram. A safety data sheet shall accompany every consignment and shall specify the neutralising agent to be kept on hand.",
        page: 11,
      },
    ],
    relatedIds: ["std-265"],
  },
  {
    id: "std-265",
    number: "IS 265:2021",
    year: 2021,
    title: "Hydrochloric Acid — Specification",
    sector: "Chemicals and Petrochemicals",
    scope:
      "Covers requirements for commercial and technical grades of hydrochloric acid supplied as an aqueous solution, including acidity, iron, sulphate and heavy metal limits and requirements for containers.",
    keywords: [
      "hydrochloric acid",
      "acid",
      "muriatic acid",
      "chemical",
      "hcl",
      "industrial chemical",
      "corrosive",
      "cleaning acid",
    ],
    status: "active",
    qcoId: "qco-chemicals",
    schemeId: "scheme-i",
    tests: [
      "Acidity as HCl by titration",
      "Iron content determination",
      "Sulphate as sulphuric acid",
      "Free chlorine content",
      "Residue on evaporation",
      "Heavy metals as lead",
    ],
    clauses: [
      {
        id: "std-265-c1",
        number: "4.2",
        title: "Composition requirements",
        text:
          "Commercial grade hydrochloric acid shall contain not less than 30.0 percent by mass of HCl and technical grade not less than 33.0 percent. Iron as Fe shall not exceed 0.01 percent for commercial grade and 0.005 percent for technical grade. Free chlorine shall not exceed 0.005 percent by mass in either grade.",
        page: 4,
      },
      {
        id: "std-265-c2",
        number: "6.1",
        title: "Sampling",
        text:
          "Samples shall be drawn with an acid-resistant sampling tube from not less than the number of containers given in Table 3 for the lot size. Composite samples shall be prepared and stored in tightly stoppered borosilicate or polyethylene bottles filled to at least 90 percent of capacity. Analysis shall be completed within seven days of sampling.",
        page: 8,
      },
      {
        id: "std-265-c3",
        number: "9.1",
        title: "Marking and safety information",
        text:
          "Containers shall be legibly marked with the material name, grade, concentration, net mass, batch number, date of manufacture and manufacturer name or trade-mark. The corrosive pictogram and the words causes severe skin burns shall be displayed. Where the Standard Mark is applied, the licence number shall accompany it on the container label.",
        page: 13,
      },
    ],
    relatedIds: ["std-266"],
  },
  {
    id: "std-14543",
    number: "IS 14543:2016",
    year: 2016,
    title: "Packaged Drinking Water (Other than Packaged Natural Mineral Water) — Specification",
    sector: "Food and Beverages",
    scope:
      "Specifies requirements for packaged drinking water sold in sealed containers, covering source treatment, physical and chemical parameters, microbiological limits, pesticide residues and container material.",
    keywords: [
      "packaged drinking water",
      "water",
      "bottled water",
      "mineral water",
      "water plant",
      "drinking water",
      "bottle",
      "food",
      "pouch",
    ],
    status: "active",
    qcoId: "qco-drinking-water",
    schemeId: "scheme-i",
    tests: [
      "Microbiological examination for coliforms and E. coli",
      "Heavy metal analysis — lead, arsenic, cadmium, mercury",
      "Pesticide residue screening",
      "Turbidity, pH and total dissolved solids",
      "Residual free chlorine and bromate",
      "Overall migration from the container",
    ],
    clauses: [
      {
        id: "std-14543-c1",
        number: "4.1",
        title: "Source water and treatment",
        text:
          "Water drawn from any source shall be treated by processes such as filtration, reverse osmosis, ultraviolet disinfection or ozonisation to render it fit for human consumption. Every treatment stage shall be documented and the treated water shall be tested at the frequency in Table 6. Blending of untreated water with treated water after final disinfection is not permitted.",
        page: 4,
      },
      {
        id: "std-14543-c2",
        number: "5.3",
        title: "Microbiological requirements",
        text:
          "Packaged drinking water shall be free from coliform organisms in any 250 ml sample examined, and shall show no Escherichia coli, Salmonella, Shigella, Vibrio cholerae or Pseudomonas aeruginosa in the sample volumes stated in Table 4. The total viable count at 37 degree C shall not exceed 20 cfu/ml and at 20 to 22 degree C shall not exceed 100 cfu/ml. Testing shall be on containers taken at random from the finished stock.",
        page: 8,
      },
      {
        id: "std-14543-c3",
        number: "5.5",
        title: "Container and closure",
        text:
          "Containers shall be of food-grade polyethylene terephthalate, polycarbonate, polypropylene or glass and shall comply with the overall migration limit of 10 mg/dm2 when tested by IS 9845. Closures shall provide tamper evidence so that opening is visible to the consumer. Reused returnable containers shall be washed, sanitised and inspected before refilling.",
        page: 11,
      },
      {
        id: "std-14543-c4",
        number: "8.1",
        title: "Labelling",
        text:
          "The label shall declare the words packaged drinking water, the net volume, the source of water, the treatment processes applied, the batch number, the date of packaging and the best-before date. The Standard Mark with the licence number shall be printed on the label as required by the licence. Claims implying medicinal or therapeutic properties shall not be made.",
        page: 16,
      },
    ],
    relatedIds: ["std-9845", "std-17803"],
  },
  {
    id: "std-9845",
    number: "IS 9845:1998",
    year: 1998,
    title:
      "Determination of Overall Migration of Constituents of Plastics Materials and Articles Intended to Come in Contact with Foodstuffs",
    sector: "Food and Beverages",
    scope:
      "Prescribes methods for determining the overall migration of constituents from plastics and other materials intended for food contact, using aqueous, acidic, alcoholic and fatty food simulants under defined time and temperature conditions.",
    keywords: [
      "migration",
      "food contact",
      "plastic",
      "food grade",
      "simulant",
      "packaging",
      "container",
      "test method",
      "leaching",
    ],
    status: "active",
    schemeId: "scheme-i",
    tests: [
      "Overall migration into distilled water",
      "Overall migration into 3 percent acetic acid",
      "Overall migration into 50 percent ethanol",
      "Overall migration into n-heptane or olive oil",
      "Total immersion and single-surface cell methods",
    ],
    clauses: [
      {
        id: "std-9845-c1",
        number: "5.1",
        title: "Choice of food simulant",
        text:
          "Simulant A of distilled water is used for aqueous foods, simulant B of 3 percent acetic acid for acidic foods of pH below 4.5, simulant C of 50 percent ethanol for alcoholic foods and simulant D of rectified olive oil or n-heptane for fatty foods. Where the intended use covers several categories, the article is tested with each applicable simulant. The simulant and the conditions selected shall be recorded in the test report.",
        page: 4,
      },
      {
        id: "std-9845-c2",
        number: "6.2",
        title: "Test conditions of time and temperature",
        text:
          "Articles intended for hot fill or repeated heating shall be tested at 70 degree C for 2 h, while articles for prolonged storage at room temperature shall be tested at 40 degree C for 10 days. The contact area to simulant volume ratio shall be 1 dm2 to 100 ml unless the article geometry requires otherwise. Conditions more severe than the intended use shall be applied where the use is not clearly defined.",
        page: 7,
      },
      {
        id: "std-9845-c3",
        number: "7.4",
        title: "Expression of results",
        text:
          "The overall migration is expressed in milligrams per square decimetre of surface area in contact with the simulant, or in milligrams per kilogram of food for containers of capacity between 0.5 and 10 litres. A blank determination shall be carried out with each set and subtracted from the result. Duplicate determinations shall agree within 1 mg/dm2.",
        page: 10,
      },
    ],
    relatedIds: ["std-17803", "std-14756", "std-14543"],
  },
  {
    id: "std-5405",
    number: "IS 5405:2019",
    year: 2019,
    title: "Sanitary Napkins — Specification",
    sector: "Medical Devices and Hygiene",
    scope:
      "Specifies requirements for disposable sanitary napkins including absorbency, rewet performance, pH of the aqueous extract, microbiological cleanliness and adhesive performance.",
    keywords: [
      "sanitary napkin",
      "sanitary pad",
      "hygiene",
      "absorbent",
      "menstrual",
      "pad",
      "disposable",
      "women",
      "medical",
    ],
    status: "active",
    qcoId: "qco-medical-hygiene",
    schemeId: "scheme-i",
    tests: [
      "Absorbency by the Syngina or sink time method",
      "Rewet under load after saturation",
      "pH of the aqueous extract",
      "Microbiological cleanliness — total viable count",
      "Adhesive peel strength on release paper",
      "Fluorescent whitening agent screening",
    ],
    clauses: [
      {
        id: "std-5405-c1",
        number: "5.2",
        title: "Absorbency requirement",
        text:
          "The absorbency of a regular size napkin shall be not less than 10 ml and of a large size napkin not less than 15 ml when determined by the method described in Annex B. Ten napkins drawn at random from the lot shall be tested and the average reported. No individual value shall be less than 80 percent of the specified minimum.",
        page: 5,
      },
      {
        id: "std-5405-c2",
        number: "5.5",
        title: "pH and freedom from harmful substances",
        text:
          "The pH of the aqueous extract prepared as in Annex D shall lie between 5.5 and 8.0. The napkin shall be free from added fluorescent whitening agents in the layer that contacts the skin and shall not contain chlorine-bleached pulp beyond the residual limits of Table 3. Fragrance, if added, shall be declared on the pack.",
        page: 8,
      },
      {
        id: "std-5405-c3",
        number: "6.1",
        title: "Microbiological cleanliness",
        text:
          "The total viable aerobic count shall not exceed 100 cfu per gram and the napkin shall be free from Staphylococcus aureus, Pseudomonas aeruginosa, Escherichia coli and Candida albicans. Samples shall be taken from intact retail packs. Manufacturing areas shall be maintained under the hygiene conditions of Annex F.",
        page: 11,
      },
      {
        id: "std-5405-c4",
        number: "9.1",
        title: "Packing and marking",
        text:
          "Napkins shall be individually wrapped in a moisture-proof wrapper and packed in a sealed outer pack. The pack shall be marked with the manufacturer name, size, number of napkins, batch number, month and year of manufacture and instructions for safe disposal. Where a licence has been granted, the Standard Mark and licence number shall appear on the retail pack.",
        page: 16,
      },
    ],
    relatedIds: ["std-4148", "std-17621"],
  },
  {
    id: "std-4148",
    number: "IS 4148:2018",
    year: 2018,
    title: "Rubber Surgical Gloves — Specification",
    sector: "Medical Devices and Hygiene",
    scope:
      "Specifies requirements for sterile and non-sterile rubber surgical gloves, covering dimensions, tensile properties before and after accelerated ageing, freedom from holes and protein content of natural rubber latex gloves.",
    keywords: [
      "surgical gloves",
      "gloves",
      "latex gloves",
      "medical device",
      "hospital",
      "sterile",
      "examination gloves",
      "rubber",
      "hygiene",
    ],
    status: "active",
    qcoId: "qco-medical-hygiene",
    schemeId: "scheme-i",
    tests: [
      "Watertightness (freedom from holes) test",
      "Tensile strength and elongation at break",
      "Accelerated ageing at 70 degree C for 7 days",
      "Dimensional measurement of length, width and thickness",
      "Extractable protein content by modified Lowry method",
      "Sterility assurance verification for sterile gloves",
    ],
    clauses: [
      {
        id: "std-4148-c1",
        number: "6.1",
        title: "Freedom from holes",
        text:
          "Each glove shall be filled with 1 000 ml of water and inspected for leakage over a period of 2 to 4 min in accordance with the method of Annex C. Sampling shall follow the inspection level and acceptable quality limit of 1.5 given in IS 2500 (Part 1). Any leakage other than at the cuff constitutes a defective glove.",
        page: 8,
      },
      {
        id: "std-4148-c2",
        number: "5.3",
        title: "Tensile properties",
        text:
          "Before ageing, natural rubber latex gloves shall have a tensile strength of not less than 24 MPa and an elongation at break of not less than 750 percent. After accelerated ageing at 70 +/- 2 degree C for 168 h these values shall be not less than 18 MPa and 560 percent respectively. Dumb-bell specimens shall be cut from the palm region.",
        page: 6,
      },
      {
        id: "std-4148-c3",
        number: "7.2",
        title: "Powder and protein residues",
        text:
          "Gloves declared as powder-free shall have a residual powder content not exceeding 2 mg per glove when determined by the gravimetric method of Annex E. Water-extractable protein in natural rubber latex gloves shall not exceed 50 micrograms per gram. The pack shall carry a caution regarding possible allergic reaction to natural rubber latex proteins.",
        page: 12,
      },
      {
        id: "std-4148-c4",
        number: "10.1",
        title: "Packing and labelling",
        text:
          "Sterile gloves shall be packed in pairs in a sealed inner wrapper that maintains sterility until opened, and the outer pack shall state the sterilisation method and the expiry date. The label shall carry the size, whether powdered or powder-free, the batch number and the manufacturer name and address. Single-use only shall be prominently stated.",
        page: 18,
      },
    ],
    relatedIds: ["std-5405", "std-17621"],
  },
  {
    id: "std-17631",
    number: "IS 17631:2022",
    year: 2022,
    title:
      "Furniture — Storage Units — Requirements for Stability, Strength, Durability and Safety",
    sector: "Furniture",
    scope:
      "Specifies safety, strength, durability and stability requirements for domestic and office storage units such as wardrobes, chests of drawers, bookcases and filing cabinets, including tip-over protection.",
    keywords: [
      "furniture",
      "wardrobe",
      "cupboard",
      "almirah",
      "storage unit",
      "bookcase",
      "chest of drawers",
      "filing cabinet",
      "tip over",
    ],
    status: "active",
    schemeId: "scheme-i",
    tests: [
      "Stability test with drawers extended and loaded",
      "Vertical static load on shelves",
      "Durability of drawer runners over 40 000 cycles",
      "Door slam durability test",
      "Formaldehyde emission from wood-based panels",
      "Surface resistance to cold liquids and abrasion",
    ],
    clauses: [
      {
        id: "std-17631-c1",
        number: "6.2",
        title: "Stability against tipping",
        text:
          "A free-standing storage unit taller than 750 mm shall not tip when a vertically downward force of 200 N is applied at the outermost point of an open drawer or an opened door at a height not exceeding 1 500 mm. Units that fail shall be supplied with a wall anchoring device and clear installation instructions. The anchoring device shall withstand a horizontal pull of 500 N when installed as instructed.",
        page: 14,
      },
      {
        id: "std-17631-c2",
        number: "5.4",
        title: "Shelf loading",
        text:
          "Shelves shall support a uniformly distributed load of 0.5 kN/m2 or the manufacturer declared load, whichever is greater, for 24 h without permanent deflection exceeding 1 percent of the span. After removal of the load the residual deflection shall not exceed 0.2 percent of the span. Fixings shall show no loosening or cracking on inspection.",
        page: 10,
      },
      {
        id: "std-17631-c3",
        number: "8.1",
        title: "Formaldehyde emission from panels",
        text:
          "Wood-based panels used in the construction shall be of emission class E1, with formaldehyde emission not exceeding 0.124 mg/m3 of air determined by the chamber method. Edges of particle board and medium density fibreboard shall be sealed on all exposed faces. A declaration of the panel emission class shall be retained by the manufacturer.",
        page: 19,
      },
      {
        id: "std-17631-c4",
        number: "11.1",
        title: "Marking and instructions",
        text:
          "The unit shall be marked with the manufacturer name or trade-mark, model reference, month and year of manufacture and the maximum load for each shelf and drawer. Assembly instructions shall include a clear warning about the risk of tip-over and the requirement to fix the unit to the wall where supplied with an anchor. Instructions shall be provided in Hindi and English.",
        page: 24,
      },
    ],
    relatedIds: ["std-17650-1"],
  },
  {
    id: "std-17650-1",
    number: "IS 17650 (Part 1):2021",
    year: 2021,
    title:
      "Household Water Treatment Systems — Part 1 Point-of-Use Water Purifiers — General Requirements",
    sector: "Household Appliances",
    scope:
      "Specifies performance and safety requirements for point-of-use household water purifiers including reverse osmosis, ultrafiltration, ultraviolet and gravity-based units, together with claims verification for contaminant reduction.",
    keywords: [
      "water purifier",
      "ro purifier",
      "uv purifier",
      "water filter",
      "drinking water",
      "household",
      "appliance",
      "tds",
      "filter",
    ],
    status: "active",
    qcoId: "qco-appliances",
    schemeId: "scheme-i",
    tests: [
      "Microbiological reduction efficiency (bacteria, virus, cyst)",
      "Total dissolved solids reduction and recovery ratio",
      "Heavy metal reduction — arsenic, lead, fluoride",
      "Material safety and migration from wetted parts",
      "Electrical safety per IS 302 (Part 1)",
      "Filter life endurance at rated throughput",
    ],
    clauses: [
      {
        id: "std-17650-1-c1",
        number: "5.2",
        title: "Microbiological reduction",
        text:
          "A purifier claiming microbiological safety shall achieve a minimum log reduction of 6 for bacteria, 4 for viruses and 3 for protozoan cysts when challenged with the test organisms of Annex B. The reduction shall be demonstrated at the start, mid-point and end of the claimed filter life. Test water of both general and challenge quality shall be used as specified in 5.4.",
        page: 9,
      },
      {
        id: "std-17650-1-c2",
        number: "6.1",
        title: "Materials in contact with water",
        text:
          "All wetted components including membranes, housings, tubing and storage tanks shall be of food-grade material and shall satisfy the overall migration limit of 10 mg/dm2 when tested by IS 9845. Materials shall not impart colour, odour or taste to the treated water. A list of wetted materials with their grades shall be submitted with the application for a licence.",
        page: 13,
      },
      {
        id: "std-17650-1-c3",
        number: "7.3",
        title: "Filter life and end-of-life indication",
        text:
          "The manufacturer shall declare the filter or membrane life in litres of throughput, and the purifier shall provide an indication to the user when 90 percent of that life has been reached. Performance claims shall be met throughout the declared life at the rated flow. Where the unit continues to dispense water after the declared life is exceeded, the instructions shall state that clearly.",
        page: 17,
      },
      {
        id: "std-17650-1-c4",
        number: "10.1",
        title: "Declaration of claims",
        text:
          "Any claim of contaminant reduction printed on the product, packaging or advertising shall be supported by test evidence generated in a recognised laboratory. Claims shall state the influent concentration, the effluent concentration and the test conditions. Unqualified claims such as 100 percent pure shall not be used.",
        page: 22,
      },
    ],
    relatedIds: ["std-14543", "std-9845", "std-302-1"],
  },
];
