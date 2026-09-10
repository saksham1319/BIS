import type {
  CertificationScheme,
  HallmarkingCentre,
  Laboratory,
  QualityControlOrder,
  Standard,
} from "@/lib/bis/types";

import { standards } from "@/lib/bis/data/standards";
import { qcos } from "@/lib/bis/data/qcos";
import { labs } from "@/lib/bis/data/labs";
import { schemes } from "@/lib/bis/data/schemes";
import { hallmarkingCentres } from "@/lib/bis/data/hallmarking";

export { standards, qcos, labs, schemes, hallmarkingCentres };

/* -------------------------------------------------------------------------- */
/* Indexes                                                                     */
/* -------------------------------------------------------------------------- */

const standardsById = new Map<string, Standard>(standards.map((s) => [s.id, s]));
const qcosById = new Map<string, QualityControlOrder>(qcos.map((q) => [q.id, q]));
const labsById = new Map<string, Laboratory>(labs.map((l) => [l.id, l]));
const schemesById = new Map<string, CertificationScheme>(
  schemes.map((s) => [s.id, s]),
);
const centresById = new Map<string, HallmarkingCentre>(
  hallmarkingCentres.map((c) => [c.id, c]),
);

/** "IS 17803:2022" -> "is17803:2022"; also indexed without the year. */
function normaliseNumber(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "");
}

const standardsByNumber = new Map<string, Standard>();
for (const standard of standards) {
  const full = normaliseNumber(standard.number);
  standardsByNumber.set(full, standard);
  // Also index the number without the ":year" suffix, e.g. "is17803".
  const withoutYear = full.split(":")[0];
  if (withoutYear && !standardsByNumber.has(withoutYear)) {
    standardsByNumber.set(withoutYear, standard);
  }
}

/* -------------------------------------------------------------------------- */
/* Lookups                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Look up a standard by its printed number. Tolerant of spacing and of a
 * missing year, so "IS 17803:2022", "IS17803" and "is 17803" all resolve.
 */
export function getStandardByNumber(number: string): Standard | undefined {
  if (!number) return undefined;
  const key = normaliseNumber(number);
  return standardsByNumber.get(key) ?? standardsByNumber.get(key.split(":")[0]);
}

export function getStandardById(id: string): Standard | undefined {
  return standardsById.get(id);
}

export function getQcoById(id: string): QualityControlOrder | undefined {
  return qcosById.get(id);
}

export function getSchemeById(id: string): CertificationScheme | undefined {
  return schemesById.get(id);
}

export function getLabById(id: string): Laboratory | undefined {
  return labsById.get(id);
}

export function getHallmarkingCentreById(
  id: string,
): HallmarkingCentre | undefined {
  return centresById.get(id);
}

/** Every standard whose `qcoId` points at the given QCO. */
export function getStandardsForQco(qcoId: string): Standard[] {
  const qco = qcosById.get(qcoId);
  const linked = qco
    ? qco.standardIds
        .map((id) => standardsById.get(id))
        .filter((s): s is Standard => s !== undefined)
    : [];
  const seen = new Set(linked.map((s) => s.id));
  for (const standard of standards) {
    if (standard.qcoId === qcoId && !seen.has(standard.id)) {
      seen.add(standard.id);
      linked.push(standard);
    }
  }
  return linked;
}

/** Laboratories recognised for a given standard number. */
export function getLabsForStandard(number: string): Laboratory[] {
  const key = normaliseNumber(number);
  const bare = key.split(":")[0];
  return labs.filter((lab) =>
    lab.recognisedFor.some((entry) => {
      const normalised = normaliseNumber(entry);
      return normalised === key || normalised.split(":")[0] === bare;
    }),
  );
}

/* -------------------------------------------------------------------------- */
/* Facets                                                                      */
/* -------------------------------------------------------------------------- */

/** Sorted, unique list of every sector present in the corpus. */
export const sectors: string[] = Array.from(
  new Set(standards.map((s) => s.sector)),
).sort((a, b) => a.localeCompare(b));

/** Sorted, unique list of every state that has a recognised laboratory. */
export const labStates: string[] = Array.from(
  new Set(labs.map((l) => l.state)),
).sort((a, b) => a.localeCompare(b));

/** Sorted, unique list of every state that has a hallmarking centre. */
export const centreStates: string[] = Array.from(
  new Set(hallmarkingCentres.map((c) => c.state)),
).sort((a, b) => a.localeCompare(b));

/** Handy for headline counters in the UI. */
export const corpusCounts = {
  standards: standards.length,
  qcos: qcos.length,
  labs: labs.length,
  schemes: schemes.length,
  centres: hallmarkingCentres.length,
  clauses: standards.reduce((total, s) => total + s.clauses.length, 0),
} as const;
