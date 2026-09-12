"use client";

import Image from "next/image";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand" aria-label="BIS Saathi">
      <span className="brand-mark" aria-hidden="true">
        <Image
          src="/logo.png"
          alt="BIS Saathi"
          width={36}
          height={36}
          priority
        />
      </span>
      {!compact && (
        <span className="brand-copy">
          <strong>BIS</strong>
          <span>Saathi</span>
        </span>
      )}
    </div>
  );
}

