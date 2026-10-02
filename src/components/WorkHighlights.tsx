"use client";

import { useState } from "react";

import { WorkItemDetail } from "@/components/details/WorkItemDetail";
import { WorkItemPreview } from "@/components/previews/WorkItemPreview";
import { CustomModal } from "@/components/primitives/CustomModal";
import type { WorkItem } from "@/content";

/**
 * The Highlights section's cards, and the dialog each one opens.
 *
 * A client component for one reason, the same one `StackGrid` is: something has
 * to hold which piece of work the dialog is showing. It takes its items as
 * props and reaches for no content of its own; the page decides what is
 * highlighted. One dialog for the whole grid rather than one per card, since
 * only one can be open.
 */
export function WorkHighlights({ items }: { items: readonly WorkItem[] }) {
  const [detail, setDetail] = useState<WorkItem | null>(null);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <WorkItemPreview
            key={item.id}
            item={item}
            layout="card"
            onOpen={setDetail}
          />
        ))}
      </div>

      {/* The same `WorkItemDetail` the work pages and the stack render, so a
          piece of work reads identically wherever it is opened. */}
      <CustomModal
        kind="card"
        item={detail}
        label={detail?.title}
        onClose={() => setDetail(null)}
      >
        {(work) => <WorkItemDetail item={work} />}
      </CustomModal>
    </>
  );
}
