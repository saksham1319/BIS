import type { HallmarkingCentre } from "@/lib/bis/types";

/**
 * Demo corpus of BIS-recognised Assaying and Hallmarking Centres (AHCs).
 *
 * Illustrative data for a demonstration build. Registration numbers follow the
 * AHC-<state>-<serial> convention used by BIS but the entries here are written
 * for the demo. Verify the live list of recognised centres on the BIS portal.
 */
export const hallmarkingCentres: HallmarkingCentre[] = [
  {
    id: "ahc-delhi-karolbagh",
    name: "Karol Bagh Assaying and Hallmarking Centre",
    city: "New Delhi",
    state: "Delhi",
    registration: "AHC-DL-0142",
    purities: ["14K", "18K", "20K", "22K", "23K", "24K"],
    contact: "+91 11 2872 5510",
  },
  {
    id: "ahc-mumbai-zaveri",
    name: "Zaveri Bazaar Assaying and Hallmarking Centre",
    city: "Mumbai",
    state: "Maharashtra",
    registration: "AHC-MH-0087",
    purities: ["14K", "18K", "22K", "24K"],
    contact: "+91 22 2342 8814",
  },
  {
    id: "ahc-bengaluru-jayanagar",
    name: "Jayanagar Precious Metals Assaying Centre",
    city: "Bengaluru",
    state: "Karnataka",
    registration: "AHC-KA-0231",
    purities: ["18K", "22K", "23K", "24K"],
    contact: "+91 80 2663 7729",
  },
  {
    id: "ahc-chennai-tnagar",
    name: "T. Nagar Assaying and Hallmarking Centre",
    city: "Chennai",
    state: "Tamil Nadu",
    registration: "AHC-TN-0119",
    purities: ["18K", "20K", "22K", "24K"],
    contact: "+91 44 2815 4402",
  },
  {
    id: "ahc-kolkata-bowbazar",
    name: "Bowbazar Gold Assaying Centre",
    city: "Kolkata",
    state: "West Bengal",
    registration: "AHC-WB-0075",
    purities: ["14K", "18K", "22K", "24K"],
    contact: "+91 33 2237 9156",
  },
  {
    id: "ahc-hyderabad-begumbazar",
    name: "Begum Bazar Assaying and Hallmarking Centre",
    city: "Hyderabad",
    state: "Telangana",
    registration: "AHC-TS-0064",
    purities: ["18K", "22K", "23K", "24K"],
    contact: "+91 40 2461 8830",
  },
  {
    id: "ahc-jaipur-johari",
    name: "Johari Bazaar Assaying and Hallmarking Centre",
    city: "Jaipur",
    state: "Rajasthan",
    registration: "AHC-RJ-0098",
    purities: ["14K", "18K", "22K", "24K"],
    contact: "+91 141 2565 471",
  },
  {
    id: "ahc-ahmedabad-manekchowk",
    name: "Manek Chowk Precious Metals Hallmarking Centre",
    city: "Ahmedabad",
    state: "Gujarat",
    registration: "AHC-GJ-0153",
    purities: ["18K", "20K", "22K", "24K"],
    contact: "+91 79 2214 6608",
  },
  {
    id: "ahc-kochi-mgroad",
    name: "M. G. Road Assaying and Hallmarking Centre",
    city: "Kochi",
    state: "Kerala",
    registration: "AHC-KL-0042",
    purities: ["18K", "22K", "24K"],
    contact: "+91 484 2367 219",
  },
  {
    id: "ahc-lucknow-chowk",
    name: "Chowk Assaying and Hallmarking Centre",
    city: "Lucknow",
    state: "Uttar Pradesh",
    registration: "AHC-UP-0207",
    purities: ["14K", "18K", "22K", "24K"],
    contact: "+91 522 2624 883",
  },
];
