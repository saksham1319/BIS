import type { CertificationScheme } from "@/lib/bis/types";

/**
 * Demo corpus of BIS certification schemes.
 *
 * Illustrative data for a demonstration build. Scheme names and the broad shape
 * of the process follow BIS conventions, but fees, timelines and document lists
 * are written for the demo. Confirm current fees and forms on the BIS Manakonline
 * portal before applying.
 */
export const schemes: CertificationScheme[] = [
  {
    id: "scheme-i",
    name: "Scheme-I — Product Certification (ISI Mark)",
    summary:
      "The mainstream BIS product certification scheme under Schedule II of the BIS (Conformity Assessment) Regulations, 2018. A licence granted under this scheme allows a manufacturer to apply the ISI mark, together with the licence number, to a product manufactured at a specific factory against a specific Indian Standard.",
    applicability:
      "Domestic manufacturers of products covered by an Indian Standard, whether the certification is voluntary or made compulsory by a Quality Control Order. Applies per product, per standard and per manufacturing location.",
    steps: [
      {
        title: "Identify the applicable Indian Standard and product variety",
        detail:
          "Confirm the exact IS number, part, section and year, and list every variety, size, grade and brand you intend to cover. The licence is granted against this list, so anything omitted cannot legally carry the mark.",
      },
      {
        title: "Establish in-house testing and quality control",
        detail:
          "Set up the testing equipment and the Scheme of Inspection and Testing required by the standard, or arrange a documented tie-up with a recognised laboratory for tests you cannot perform. Nominate a qualified person in charge of quality control.",
      },
      {
        title: "Apply online through the Manakonline portal",
        detail:
          "Register the firm, complete Form-I, upload the factory and machinery details, process flow, test equipment list and calibration certificates, and pay the application fee. An acknowledgement with an application number is issued immediately.",
      },
      {
        title: "Preliminary factory inspection by a BIS officer",
        detail:
          "A BIS officer visits the factory, verifies the manufacturing and testing infrastructure, witnesses in-house tests and draws samples. Samples are sealed and sent to a BIS-recognised laboratory at the applicant's cost.",
      },
      {
        title: "Independent laboratory testing of drawn samples",
        detail:
          "The recognised laboratory tests the sealed samples against every clause of the standard and reports directly to BIS. Any non-conforming parameter must be corrected and re-tested before the file can proceed.",
      },
      {
        title: "Grant of licence and signing of the agreement",
        detail:
          "On satisfactory inspection and test reports, BIS grants the licence, and the manufacturer signs the agreement and pays the licence and marking fees. The ISI mark with the CM/L number may then be applied.",
      },
      {
        title: "Operate the licence and prepare for surveillance",
        detail:
          "Maintain production and test records for every lot, retain them for the period stated in the Scheme of Inspection and Testing, and renew the licence before expiry. BIS conducts surveillance inspections and market sample testing without prior notice.",
      },
    ],
    documents: [
      "Certificate of incorporation, partnership deed or proprietorship declaration",
      "GST registration certificate and PAN of the firm",
      "Factory licence or Udyam / MSME registration certificate",
      "Manufacturing process flow chart with in-process control points",
      "List of manufacturing machinery with capacity and installation dates",
      "List of test equipment with valid NABL-traceable calibration certificates",
      "Layout plan of the factory and the in-house testing laboratory",
      "Qualification and appointment letter of the person in charge of quality control",
      "Test reports of the product against the relevant Indian Standard, if already available",
    ],
    fees: [
      { label: "Application fee (non-refundable)", amount: "₹1,000" },
      { label: "Licence fee (per licence)", amount: "₹1,000" },
      { label: "Annual minimum marking fee", amount: "₹25,000" },
      { label: "Preliminary factory inspection charges (per man-day)", amount: "₹7,000" },
      { label: "Sample testing charges (indicative, per product)", amount: "₹12,000 to ₹60,000" },
    ],
    timeline:
      "Typically 45 to 90 days from a complete application to grant, depending on laboratory turnaround and whether the first sample passes.",
  },
  {
    id: "scheme-ii",
    name: "Scheme-II — Compulsory Registration Scheme (CRS) for Electronics and IT Goods",
    summary:
      "A self-declaration based registration route operated under Schedule II of the BIS (Conformity Assessment) Regulations, 2018 for notified electronics and IT products. Instead of a factory inspection, the manufacturer submits a test report from a BIS-recognised laboratory and receives a registration number that must be displayed on the product.",
    applicability:
      "Indian and foreign manufacturers of electronics and IT goods notified under the MeitY Compulsory Registration Order, such as laptops, mobile phones, power banks, LED lamps, adaptors and lithium-ion batteries. Registration is granted per model and per manufacturing location.",
    steps: [
      {
        title: "Confirm the product is in the notified CRS list",
        detail:
          "Check the MeitY notification schedule and identify the exact Indian Standard applicable to the product category. Products not in the list cannot be registered under this scheme.",
      },
      {
        title: "Foreign manufacturers appoint an Authorised Indian Representative",
        detail:
          "An overseas manufacturer must nominate an Authorised Indian Representative who is legally resident in India and accepts liability for the product in the Indian market. The nomination is executed on a notarised affidavit.",
      },
      {
        title: "Get the product tested in a BIS-recognised laboratory",
        detail:
          "Submit samples of each model to a laboratory listed as recognised for the relevant standard. The report is uploaded by the laboratory directly and must be less than 90 days old at the time of application.",
      },
      {
        title: "File the online application with the test report",
        detail:
          "Complete the registration application on the BIS portal, attach the test report, brand authorisation, factory address proof and the model and series justification for any families of models. Pay the application and registration fees online.",
      },
      {
        title: "Scrutiny, query resolution and grant of registration",
        detail:
          "BIS scrutinises the application and may raise queries that must be answered within the stated period. On acceptance, a registration number in the format R-XXXXXXXX is granted and published in the online registry.",
      },
      {
        title: "Mark the product and maintain the registration",
        detail:
          "Display the Self Declaration of Conformity mark with the registration number on the product, the packaging and the user manual. Renew before expiry and inform BIS of any change in the product design, brand or factory address.",
      },
    ],
    documents: [
      "Test report from a BIS-recognised laboratory, not older than 90 days",
      "Business registration documents of the manufacturing unit",
      "Factory address proof and manufacturing licence",
      "Trade-mark registration certificate or brand authorisation letter",
      "Authorised Indian Representative nomination and affidavit, for foreign manufacturers",
      "Product technical specification sheet, circuit diagram and bill of materials",
      "Model and series justification chart for families of models",
      "Undertaking on the letterhead of the manufacturer regarding conformity",
    ],
    fees: [
      { label: "Application fee", amount: "₹1,000" },
      { label: "Registration fee (per model)", amount: "₹5,000" },
      { label: "Renewal fee (per model, per two years)", amount: "₹5,000" },
      { label: "Laboratory testing charges (indicative)", amount: "₹20,000 to ₹1,50,000" },
    ],
    timeline:
      "Usually 20 to 30 working days from a complete application, once the laboratory test report is in hand. Laboratory testing itself commonly takes 3 to 6 weeks.",
  },
  {
    id: "scheme-hallmarking",
    name: "Hallmarking Registration for Jewellers and Assaying Centres",
    summary:
      "The registration scheme under the Hallmarking Regulations that allows a jeweller to sell hallmarked precious metal articles bearing a six-digit alphanumeric HUID. Every hallmarked article carries the BIS logo, the purity or fineness mark and the HUID applied at a recognised Assaying and Hallmarking Centre.",
    applicability:
      "Jewellers, retailers and wholesalers dealing in gold and silver articles, and organisations seeking recognition to operate an Assaying and Hallmarking Centre. Registration is issued to the firm and covers its listed sales outlets.",
    steps: [
      {
        title: "Register the firm on the BIS hallmarking portal",
        detail:
          "Create an account on the hallmarking module, enter the firm details, GST number and the address of every outlet to be covered. Registration for jewellers is granted online and is valid for the life of the firm subject to compliance.",
      },
      {
        title: "Send articles to a recognised Assaying and Hallmarking Centre",
        detail:
          "Deposit the finished articles with a recognised centre along with the declared purity. Articles are logged in the centre's system against your registration number before testing begins.",
      },
      {
        title: "Assaying by fire assay or XRF",
        detail:
          "The centre determines the fineness of each article or lot by X-ray fluorescence for screening and by cupellation fire assay for confirmation where required. Articles that fail the declared purity are returned and cannot be hallmarked.",
      },
      {
        title: "Application of the hallmark and HUID",
        detail:
          "Conforming articles receive the BIS logo, the purity grade such as 22K916, the mark of the assaying centre and a unique six-digit alphanumeric HUID by laser or punch. The HUID is registered in the central database against the jeweller.",
      },
      {
        title: "Sell with a compliant invoice and display",
        detail:
          "The sale invoice must record the description of the article, net weight of precious metal, purity, hallmarking charges and the HUID. Display the BIS registration certificate and the hallmark explanation chart at the outlet.",
      },
      {
        title: "Cooperate with surveillance and consumer verification",
        detail:
          "BIS conducts market surveillance and may draw articles for testing. Consumers can verify any HUID through the official verification app, so records at the outlet must match the central database.",
      },
    ],
    documents: [
      "GST registration certificate of the jewellery firm",
      "PAN card of the firm and identity proof of the proprietor or partners",
      "Address proof for the head office and each sales outlet",
      "Firm registration document — partnership deed, incorporation certificate or Udyam registration",
      "Photographs of the premises showing the display area",
      "Bank account details for fee payment and refunds",
      "Undertaking to comply with the Hallmarking Regulations and to maintain HUID records",
    ],
    fees: [
      { label: "Jeweller registration fee", amount: "₹0 (waived under the current dispensation)" },
      { label: "Hallmarking charge per gold article", amount: "₹45" },
      { label: "Hallmarking charge per silver article", amount: "₹35" },
      { label: "Minimum charge per consignment", amount: "₹200" },
      { label: "Assaying and Hallmarking Centre recognition fee", amount: "₹15,000" },
    ],
    timeline:
      "Jeweller registration is granted online, usually within 1 to 3 working days. Hallmarking of a consignment at a centre typically takes 1 to 4 working days depending on the load.",
  },
  {
    id: "scheme-fmcs",
    name: "Foreign Manufacturers Certification Scheme (FMCS)",
    summary:
      "The route by which a manufacturer located outside India obtains a BIS licence to apply the ISI mark to products exported to India. It mirrors Scheme-I but adds a nominated Authorised Indian Representative, a performance bank guarantee and inspection of the overseas factory.",
    applicability:
      "Overseas manufacturers of products covered by an Indian Standard, particularly where a Quality Control Order makes certification compulsory for imports, such as steel, cement, chemicals, toys and footwear.",
    steps: [
      {
        title: "Nominate an Authorised Indian Representative",
        detail:
          "Appoint a person or entity resident in India who will represent the manufacturer before BIS and accept liability for the certified product in India. The nomination must be on a notarised and apostilled document.",
      },
      {
        title: "Submit the application with the overseas factory details",
        detail:
          "File the application on the BIS portal with the factory profile, machinery, in-house laboratory details, process flow and the list of product varieties. Documents in a language other than English must be accompanied by certified translations.",
      },
      {
        title: "Pay the application fee and arrange the inspection visit",
        detail:
          "Pay the application and inspection charges including the travel and stay of the BIS officers. Inspection dates are fixed jointly and require visa and logistics support from the applicant.",
      },
      {
        title: "Overseas factory inspection and sample sealing",
        detail:
          "BIS officers audit the manufacturing and testing capability at the overseas plant, witness tests and seal samples. Sealed samples are shipped to an Indian recognised laboratory for independent testing.",
      },
      {
        title: "Furnish the performance bank guarantee",
        detail:
          "Before the licence is granted, submit a performance bank guarantee from a scheduled Indian bank of the value prescribed for the product category. The guarantee must remain valid throughout the licence period plus the claim window.",
      },
      {
        title: "Grant of licence and marking of exports to India",
        detail:
          "On grant, apply the ISI mark with the CM/L number to the products shipped to India and declare the licence number on shipping and customs documents. Customs may verify the licence status at the port of entry.",
      },
    ],
    documents: [
      "Business registration and factory licence of the overseas manufacturer, with certified translation",
      "Notarised and apostilled nomination of the Authorised Indian Representative",
      "Manufacturing process flow chart and plant layout",
      "List of manufacturing and test equipment with calibration status",
      "In-house quality control manual and Scheme of Inspection and Testing",
      "Performance bank guarantee from a scheduled Indian bank",
      "Trade-mark registration or brand ownership evidence",
      "Undertaking to allow BIS surveillance inspection of the overseas plant",
      "Export history and consignment details for the Indian market",
    ],
    fees: [
      { label: "Application fee", amount: "₹65,000" },
      { label: "Licence fee (per licence)", amount: "₹1,000" },
      { label: "Annual minimum marking fee", amount: "₹1,00,000" },
      { label: "Inspection charges (per man-day, plus travel and stay)", amount: "US$ 700" },
      { label: "Performance bank guarantee (product dependent)", amount: "₹10,00,000 upwards" },
    ],
    timeline:
      "Commonly 4 to 8 months from a complete application to grant, driven by inspection scheduling, sample shipping and bank guarantee formalities.",
  },
  {
    id: "scheme-ecomark",
    name: "ECO Mark Scheme for Environment Friendly Products",
    summary:
      "A voluntary certification that allows a product already meeting its Indian Standard to additionally carry the ECO Mark earthen pitcher logo, on the basis of environmental criteria notified for the product category by the Ministry of Environment, Forest and Climate Change.",
    applicability:
      "Manufacturers of products in notified ECO Mark categories such as paints, paper, plastics, detergents, textiles, wood substitutes, cosmetics and packaging, who already hold or are eligible for an ISI licence for the same product.",
    steps: [
      {
        title: "Confirm the ECO Mark criteria for your product category",
        detail:
          "Locate the gazette notification listing the environmental criteria for your category, covering aspects such as raw material source, emissions, recyclability and biodegradability. These criteria apply in addition to the product Indian Standard.",
      },
      {
        title: "Obtain or hold a valid ISI licence for the product",
        detail:
          "The ECO Mark is granted only in conjunction with a Scheme-I licence for the same product and factory. Apply for the product licence first if you do not already hold one.",
      },
      {
        title: "Compile the environmental evidence",
        detail:
          "Assemble consent to operate from the State Pollution Control Board, effluent and emission test reports, and evidence of the specific environmental parameters in the criteria. Life-cycle information may be required for some categories.",
      },
      {
        title: "Apply for the ECO Mark endorsement",
        detail:
          "Submit the ECO Mark application referencing the existing licence, attach the environmental evidence and pay the additional fee. The application is processed alongside the product licence file.",
      },
      {
        title: "Inspection and grant of the endorsement",
        detail:
          "BIS verifies the environmental parameters during a factory visit and may draw samples for testing against the notified criteria. On success, the licence is endorsed to permit use of the ECO Mark alongside the ISI mark.",
      },
    ],
    documents: [
      "Valid ISI licence or a live Scheme-I application for the same product",
      "Consent to operate from the State Pollution Control Board",
      "Effluent and emission monitoring reports for the last two quarters",
      "Raw material sourcing declaration with recycled or renewable content details",
      "Environmental management system certificate, where held",
      "Product test reports against the notified ECO Mark criteria",
      "Undertaking on continued compliance with the environmental criteria",
    ],
    fees: [
      { label: "ECO Mark application fee", amount: "₹5,000" },
      { label: "Additional annual marking fee", amount: "₹15,000" },
      { label: "Criteria verification testing (indicative)", amount: "₹18,000" },
    ],
    timeline:
      "About 30 to 60 days once a valid product licence is in place, since the environmental verification is folded into the product inspection cycle.",
  },
  {
    id: "scheme-msc",
    name: "Management Systems Certification (QMS, EMS, FSMS and OHSMS)",
    summary:
      "Certification of an organisation's management system rather than a product, covering quality management to IS/ISO 9001, environmental management to IS/ISO 14001, food safety management to IS/ISO 22000 and occupational health and safety to IS/ISO 45001.",
    applicability:
      "Manufacturing, service and processing organisations of any size seeking third-party certification of a management system, often as a prerequisite in tenders or as supporting evidence for a product certification application.",
    steps: [
      {
        title: "Select the standard and define the scope",
        detail:
          "Choose the management system standard and write a scope statement naming the sites, processes and products covered. The scope appears on the certificate and determines the audit duration.",
      },
      {
        title: "Implement the system and run it for at least three months",
        detail:
          "Document the policy, objectives, processes and controls, and generate real records. Certification bodies expect evidence that the system has been operating, not merely written.",
      },
      {
        title: "Conduct an internal audit and management review",
        detail:
          "Complete a full internal audit covering every clause and every site in scope, record the non-conformities and close them. Hold a documented management review meeting with the inputs and outputs required by the standard.",
      },
      {
        title: "Stage 1 audit — documentation and readiness",
        detail:
          "The audit team reviews the documented information, evaluates site-specific conditions and confirms readiness for the Stage 2 audit. Gaps identified here must be addressed before Stage 2.",
      },
      {
        title: "Stage 2 audit — implementation and effectiveness",
        detail:
          "The team audits the implementation and effectiveness of the system on site, sampling processes, records and personnel. Major non-conformities require corrective action and verification before a recommendation can be made.",
      },
      {
        title: "Grant of certificate and surveillance cycle",
        detail:
          "The certificate is issued for three years, subject to annual surveillance audits and a recertification audit before expiry. Changes to scope, sites or key processes must be notified to the certification body.",
      },
    ],
    documents: [
      "Management system manual or documented information covering all clauses",
      "Policy statement and measurable objectives",
      "Process maps, procedures and work instructions",
      "Internal audit programme, reports and non-conformity closure records",
      "Management review minutes with inputs and outputs",
      "Statutory and regulatory compliance register with current licences",
      "Organisation chart with responsibilities and authorities",
      "Training records and competence evaluations for key personnel",
    ],
    fees: [
      { label: "Application fee", amount: "₹10,000" },
      { label: "Audit charges (per auditor man-day)", amount: "₹12,000" },
      { label: "Annual certification fee", amount: "₹30,000" },
      { label: "Surveillance audit (per visit, indicative)", amount: "₹24,000" },
    ],
    timeline:
      "Roughly 3 to 6 months from application to certificate, most of which is the organisation's own implementation and evidence-building period.",
  },
];
