"use client";

import { SealCheck } from "@phosphor-icons/react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand" aria-label="BIS Intelligence">
      <span className="brand-mark" aria-hidden="true">
        <SealCheck size={compact ? 20 : 22} weight="fill" />
      </span>
      {!compact && (
        <span className="brand-copy">
          <strong>BIS</strong>
          <span>Intelligence</span>
        </span>
      )}
    </div>
  );
}
