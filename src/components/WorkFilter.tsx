"use client";

import { useState, type ReactNode } from "react";

import { CustomButton } from "@/components/primitives/CustomButton";

/**
 * One kind of work, already rendered. The cards arrive as `children` rather
 * than as data: they are server components, and only which group is showing is
 * a client decision, so nothing about a work item or a stack mark has to reach
 * the browser as JSON.
 *
 * `label` is the kind of work, and it does two jobs: it names the button in
 * the row, and it heads the group below while every group is shown.
 */
type Group = {
  id: string;
  label: string;
  count: number;
  children: ReactNode;
};

/**
 * Everything done in one role, with a row of counts above it.
 *
 * A client component for one reason, the same one `StackGrid` is: something has
 * to hold which button is pressed.
 *
 * Showing all is the default and keeps the per-area labels, which is exactly
 * what the page rendered before the filter existed, so the exported HTML is
 * complete and the page works with JavaScript off.
 */
export function WorkFilter({ groups }: { groups: readonly Group[] }) {
  const [active, setActive] = useState<string | null>(null);

  const total = groups.reduce((sum, group) => sum + group.count, 0);
  const shown = active ? groups.filter((group) => group.id === active) : groups;

  return (
    <div>
      <div
        role="group"
        aria-label="Show one kind of work"
        className="mb-8 flex flex-wrap gap-2"
      >
        {/* Selected is the primary fill, the rest are secondary: the same two
            variants the contact buttons use, so a pressed chip is the same
            object as the site's other loudest control. */}
        <CustomButton
          label="All"
          count={total}
          pressed={active === null}
          variant={active === null ? "primary" : "secondary"}
          onPress={() => setActive(null)}
        />
        {groups.map((group) => (
          <CustomButton
            key={group.id}
            label={group.label}
            count={group.count}
            pressed={active === group.id}
            variant={active === group.id ? "primary" : "secondary"}
            onPress={() => setActive(group.id)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-10">
        {shown.map((group) => (
          <div key={group.id}>
            {/* Only while every group is listed. Narrowed to one, the pressed
                button above already names it, and a label repeating the button
                directly under it says nothing twice. */}
            {active === null ? (
              <p className="eyebrow mb-4">{group.label}</p>
            ) : null}
            <div className="flex flex-col gap-3">{group.children}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
