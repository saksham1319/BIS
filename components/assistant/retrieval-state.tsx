"use client";

import {CheckCircle, MagnifyingGlass} from "@phosphor-icons/react";

export interface RetrievalStateProps {
    /** The step currently in progress, streamed from the server. */
    status: string | null;
    /** Steps that already finished, in the order they completed. */
    completed: string[];
}

const FALLBACK_STATUS = "Searching Indian Standards";

/**
 * Live retrieval progress. Completed steps stay ticked; the active step shimmers.
 */
export function RetrievalState({status, completed}: RetrievalStateProps) {
    const active = status ?? FALLBACK_STATUS;
    const done = completed.filter((step) => step !== active);

    return (
        <div className="retrieval-state" role="status" aria-live="polite">
            <div className="retrieval-mark"><MagnifyingGlass size={21}/></div>
            <div>
                <strong>Building a source-backed answer</strong>
                <div className="retrieval-steps">
                    {done.map((step, index) => (
                        <span key={`${step}-${index}`} className="is-done" style={{animationDelay: `${index * 60}ms`}}>
                            <CheckCircle size={15} weight="fill"/> {step}
                        </span>
                    ))}
                    <span key={active} className="is-active" style={{animationDelay: `${done.length * 60}ms`}}>
                        <CheckCircle size={15}/> <em>{active}</em>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default RetrievalState;
