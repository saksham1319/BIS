"use client";

import Image from "next/image";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand" aria-label="BIS Sathi">
      <span className="brand-mark" aria-hidden="true">
        <Image
          src="/logo.png"
          alt="BIS Sathi"
          width={36}
          height={36}
          priority
        />
      </span>
      {!compact && (
        <span className="brand-copy">
          <strong>BIS</strong>
          <span>Sathi</span>
        </span>
      )}
    </div>
  );
}

