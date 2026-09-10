import type { QualityControlOrder } from "@/lib/bis/types";

/**
 * Demo corpus of Quality Control Orders (QCOs) for BIS Sathi.
 *
 * Illustrative data for a demonstration build. Order names, ministries and
 * notification references follow real Government of India conventions but the
 * dates, coverage bullets and exemptions are written for the demo. Verify
 * against the official gazette notification before relying on any detail.
 */
export const qcos: QualityControlOrder[] = [
  {
    id: "qco-utensils",
    name: "Stainless Steel and Aluminium Utensils (Quality Control) Order, 2024",
    ministry: "Ministry of Commerce and Industry (DPIIT)",
    notification: "S.O. 1250(E) dated 14 March 2024",
    effectiveFrom: "2024-09-01",
    status: "in-force",
    coverage: [
      "Stainless steel utensils for cooking, serving and storage of food",
      "Stainless steel vacuum insulated flasks, bottles and tumblers",
      "Aluminium utensils and pressure cookware for domestic use",
      "Imported utensils cleared for sale in the domestic market",
    ],
    exemptions: [
      "Goods manufactured exclusively for export",
      "Units with annual turnover below the notified MSME threshold, until the deferred date",
      "Articles imported in quantities of up to 100 units for research, testing or sample display",
      "Utensils forming part of a machine or industrial plant and not sold separately",
    ],
    standardIds: ["std-14756", "std-17803", "std-2347", "std-15111-1"],
    summary:
      "Brings household stainless steel and aluminium utensils, including vacuum insulated bottles and pressure cookware, under compulsory BIS certification with the Standard Mark. Manufacturers, importers and sellers must hold a valid licence before goods are manufactured, imported, stored for sale or distributed.",
  },
  {
    id: "qco-electronics",
    name:
      "Electronics and Information Technology Goods (Requirements for Compulsory Registration) Order, 2021",
    ministry: "Ministry of Electronics and Information Technology (MeitY)",
    notification: "S.O. 4227(E) dated 12 October 2021, as amended",
    effectiveFrom: "2022-04-01",
    status: "in-force",
    coverage: [
      "Laptops, tablets, desktop computers and monitors",
      "Mobile phones, power banks, adaptors and chargers",
      "LED lamps, luminaires and self-ballasted LED products",
      "Televisions, set-top boxes and audio equipment",
      "Lithium-ion cells and battery packs for portable applications",
    ],
    exemptions: [
      "Goods manufactured for export and not diverted to the domestic market",
      "Products imported for research and development in quantities not exceeding 100 units",
      "Goods supplied to defence and strategic establishments against a specific certificate",
      "Refurbished products already registered under an earlier valid registration",
    ],
    standardIds: ["std-16333-3", "std-13252-1", "std-16102-1", "std-16046-2"],
    summary:
      "Requires notified electronics and IT goods to be registered with BIS under the Compulsory Registration Scheme before being sold in India, with testing carried out in a BIS-recognised laboratory. Registered products must display the Self Declaration of Conformity mark with the R-number on the product and the packaging.",
  },
  {
    id: "qco-steel",
    name: "Steel and Steel Products (Quality Control) Order, 2020",
    ministry: "Ministry of Steel",
    notification: "S.O. 2646(E) dated 17 July 2020, as amended",
    effectiveFrom: "2021-01-15",
    status: "in-force",
    coverage: [
      "High strength deformed bars and wires for concrete reinforcement",
      "Hot rolled medium and high tensile structural steel",
      "Galvanized steel strip and sheet, plain and corrugated",
      "Imported steel of the notified grades cleared through customs",
    ],
    exemptions: [
      "Steel manufactured for export against a confirmed export order",
      "Small quantities imported for research, testing or prototype development",
      "Steel supplied against defence and railway specifications with a specific exemption",
    ],
    standardIds: ["std-1786", "std-2062", "std-277"],
    summary:
      "Places notified steel grades under mandatory BIS certification so that no person may manufacture, store, sell or import them without the Standard Mark. Foreign mills supplying to India must obtain a licence under the Foreign Manufacturers Certification Scheme before shipment.",
  },
  {
    id: "qco-cement",
    name: "Cement (Quality Control) Order, 2003",
    ministry: "Ministry of Commerce and Industry (DPIIT)",
    notification: "S.O. 200(E) dated 17 February 2003, as amended",
    effectiveFrom: "2003-08-01",
    status: "in-force",
    coverage: [
      "Ordinary Portland cement of 33, 43 and 53 grades",
      "Portland pozzolana cement and Portland slag cement",
      "Rapid hardening and sulphate resisting cement",
      "Imported cement and clinker ground in India for sale",
    ],
    exemptions: [
      "Cement manufactured solely for captive consumption within the producing plant",
      "Cement manufactured for export",
      "Trial production quantities cleared for laboratory evaluation only",
    ],
    standardIds: ["std-269", "std-8112"],
    summary:
      "Makes BIS certification compulsory for all cement manufactured, imported or sold in India, with the Standard Mark and licence number printed on every bag. Bulk supplies must be accompanied by a test certificate traceable to the certified production lot.",
  },
  {
    id: "qco-toys",
    name: "Toys (Quality Control) Order, 2020",
    ministry: "Ministry of Commerce and Industry (DPIIT)",
    notification: "S.O. 853(E) dated 25 February 2020, as amended",
    effectiveFrom: "2021-01-01",
    status: "in-force",
    coverage: [
      "Non-electric toys for children below 14 years of age",
      "Electric toys and battery-operated ride-on toys",
      "Toys imported for retail sale, including through e-commerce",
      "Promotional toys supplied free with other goods",
    ],
    exemptions: [
      "Toys manufactured for export",
      "Goods manufactured by artisans registered under the Geographical Indications of Goods Act, 1999",
      "Samples imported in quantities not exceeding 100 pieces for testing or exhibition",
    ],
    standardIds: ["std-9873-1", "std-9873-3", "std-15644"],
    summary:
      "Requires every toy sold in India to carry the ISI mark under a BIS licence covering mechanical, chemical and, where applicable, electrical safety. Domestic and foreign manufacturers alike must hold a licence, and e-commerce listings must display the licence number.",
  },
  {
    id: "qco-helmets",
    name:
      "Helmets for Riders of Two Wheeled Motor Vehicles (Quality Control) Order, 2020",
    ministry: "Ministry of Road Transport and Highways",
    notification: "S.O. 4252(E) dated 26 November 2020",
    effectiveFrom: "2021-06-01",
    status: "in-force",
    coverage: [
      "Full face, open face and half-shell protective helmets for two wheeler riders",
      "Helmets supplied with new two wheelers by vehicle manufacturers",
      "Imported helmets offered for retail sale in India",
      "Replacement visors sold as accessories for certified helmet models",
    ],
    exemptions: [
      "Helmets manufactured exclusively for export",
      "Racing and motorsport helmets certified to an equivalent international standard and not sold for road use",
      "Helmets imported as a personal effect in a quantity of one",
    ],
    standardIds: ["std-4151", "std-14887"],
    summary:
      "Prohibits the manufacture, storage, sale or import of protective helmets for two wheeler riders unless they bear the Standard Mark against IS 4151. Sale of non-certified helmets, including through online marketplaces, attracts penalties under the BIS Act, 2016.",
  },
  {
    id: "qco-footwear",
    name: "Footwear made of Leather and Other Materials (Quality Control) Order, 2024",
    ministry: "Ministry of Commerce and Industry (DPIIT)",
    notification: "S.O. 3225(E) dated 22 July 2024",
    effectiveFrom: "2025-01-01",
    status: "in-force",
    coverage: [
      "Safety footwear with protective toecaps for industrial use",
      "Rubber hawai chappals and moulded slippers",
      "Leather and synthetic footwear for adults and children",
      "Imported footwear offered for retail sale",
    ],
    exemptions: [
      "Footwear manufactured for export",
      "Handcrafted footwear produced by artisans registered under a Geographical Indication",
      "Units with annual turnover below the notified MSME threshold, until the deferred date",
      "Sample consignments of up to 50 pairs imported for design evaluation",
    ],
    standardIds: ["std-15298-2", "std-6721"],
    summary:
      "Brings notified categories of footwear under compulsory BIS certification, requiring the ISI mark on each pair and on the retail packaging. Micro and small units have been given a phased compliance timeline through subsequent amendments to the order.",
  },
  {
    id: "qco-batteries",
    name:
      "Electric Vehicle Batteries and Charging Systems (Quality Control) Order, 2023",
    ministry: "Ministry of Heavy Industries",
    notification: "S.O. 1911(E) dated 24 April 2023",
    effectiveFrom: "2024-03-01",
    status: "in-force",
    coverage: [
      "Lithium-ion cells and battery packs for electric two and three wheelers",
      "Battery management systems supplied as part of a traction battery",
      "AC and DC conductive charging equipment for electric vehicles",
      "Charging cables and vehicle couplers sold as replacements",
    ],
    exemptions: [
      "Batteries and chargers manufactured for export",
      "Prototype packs used for homologation and type approval testing",
      "Systems supplied to defence and paramilitary organisations under a specific exemption",
    ],
    standardIds: ["std-16046-2", "std-17017-1"],
    summary:
      "Requires traction batteries and electric vehicle charging equipment to be certified against the notified Indian Standards before being sold or fitted in India. It follows a series of thermal incidents in electric two wheelers and places explicit obligations on battery management and charging protection.",
  },
  {
    id: "qco-textiles",
    name: "Polyester Fibre and Yarn (Quality Control) Order, 2023",
    ministry: "Ministry of Textiles",
    notification: "S.O. 1359(E) dated 20 March 2023, as amended",
    effectiveFrom: "2023-10-01",
    status: "in-force",
    coverage: [
      "Polyester continuous filament fully drawn and partially oriented yarn",
      "Polyester staple fibre, including fibre made from recycled feedstock",
      "Polyester industrial yarn for technical textile applications",
      "Imported polyester fibre and yarn cleared for domestic processing",
    ],
    exemptions: [
      "Fibre and yarn manufactured for export",
      "Quantities up to 500 kg imported for research and product development",
      "Speciality yarns produced in pilot plants and not offered for commercial sale",
    ],
    standardIds: ["std-17262", "std-15570"],
    summary:
      "Places polyester fibre and yarn under compulsory BIS certification to curb the entry of substandard imported feedstock into Indian textile value chains. Spinners and importers must hold a licence, and consignments must be traceable to a certified merge and lot.",
  },
  {
    id: "qco-chemicals",
    name: "Chemicals and Petrochemicals (Quality Control) Order, 2024",
    ministry:
      "Ministry of Chemicals and Fertilizers (Department of Chemicals and Petrochemicals)",
    notification: "S.O. 2478(E) dated 11 June 2024",
    effectiveFrom: "2024-12-15",
    status: "in-force",
    coverage: [
      "Sulphuric acid in commercial, battery and technical grades",
      "Hydrochloric acid in commercial and technical grades",
      "Bulk industrial solvents notified in the schedule to the order",
      "Imported consignments of the notified chemicals",
    ],
    exemptions: [
      "Chemicals manufactured for export",
      "Laboratory reagent grades supplied in pack sizes of 5 litres or less",
      "Intermediates produced and consumed captively within an integrated plant",
    ],
    standardIds: ["std-265", "std-266"],
    summary:
      "Requires notified industrial chemicals to conform to the corresponding Indian Standard and carry the Standard Mark on every container. Importers must obtain a licence under the Foreign Manufacturers Certification Scheme for the overseas plant of origin.",
  },
  {
    id: "qco-drinking-water",
    name: "Packaged Drinking Water and Mineral Water (Quality Control) Order, 2024",
    ministry:
      "Ministry of Health and Family Welfare (in consultation with FSSAI)",
    notification: "S.O. 941(E) dated 27 February 2024",
    effectiveFrom: "2024-08-01",
    status: "in-force",
    coverage: [
      "Packaged drinking water sold in bottles, jars, cans and pouches",
      "Packaged natural mineral water",
      "Water dispensed from bulk 20 litre returnable containers",
      "Water bottling units supplying institutional customers",
    ],
    exemptions: [
      "Water packaged for export",
      "Water supplied free of charge during declared relief operations",
      "Pilot production of not more than 200 litres for validation of a new line",
    ],
    standardIds: ["std-14543"],
    summary:
      "Requires every packaged drinking water unit to hold a BIS licence in addition to its FSSAI licence, with the Standard Mark printed on each label. The order tightens surveillance sampling of small bottling units and returnable jar operations.",
  },
  {
    id: "qco-medical-hygiene",
    name:
      "Sanitary Products and Medical Rubber Goods (Quality Control) Order, 2023",
    ministry:
      "Ministry of Chemicals and Fertilizers (Department of Pharmaceuticals)",
    notification: "S.O. 3760(E) dated 28 August 2023",
    effectiveFrom: "2024-04-01",
    status: "in-force",
    coverage: [
      "Disposable sanitary napkins and panty liners",
      "Rubber surgical and examination gloves",
      "Reusable textile protective face covers offered for retail sale",
      "Imported hygiene and medical rubber products",
    ],
    exemptions: [
      "Products manufactured for export",
      "Products supplied under government welfare distribution schemes against a specific exemption",
      "Clinical evaluation samples in quantities not exceeding 200 units",
    ],
    standardIds: ["std-5405", "std-4148", "std-17621"],
    summary:
      "Brings sanitary napkins, surgical gloves and reusable face covers under compulsory BIS certification with defined absorbency, barrier and cleanliness requirements. Manufacturers must demonstrate hygienic production conditions in addition to product testing.",
  },
  {
    id: "qco-appliances",
    name: "Household Electrical Appliances (Quality Control) Order, 2022",
    ministry: "Ministry of Commerce and Industry (DPIIT)",
    notification: "S.O. 5024(E) dated 26 October 2022, as amended",
    effectiveFrom: "2023-04-01",
    status: "in-force",
    coverage: [
      "Mixers, grinders, food processors and other kitchen machines",
      "Domestic LPG gas stoves and cooktops",
      "Pressure cookers of aluminium and stainless steel construction",
      "Electrical storage water heaters and household water purifiers",
      "PVC insulated wiring cables, plugs, sockets and switch accessories",
    ],
    exemptions: [
      "Appliances manufactured for export",
      "Appliances designed for industrial or commercial catering use above the notified rating",
      "Units with annual turnover below the notified MSME threshold, until the deferred date",
      "Spare parts supplied for the servicing of appliances certified before the order came into force",
    ],
    standardIds: [
      "std-302-1",
      "std-302-2-201",
      "std-4246",
      "std-2347",
      "std-15111-1",
      "std-694",
      "std-1293",
      "std-16058",
      "std-17650-1",
    ],
    summary:
      "Requires the notified household electrical appliances and wiring accessories to bear the ISI mark under a BIS licence before manufacture, storage, sale or import. Retailers and online marketplaces must be able to produce the licence number for every listed model.",
  },
];
