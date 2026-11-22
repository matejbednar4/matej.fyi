import { CustomMedia } from "@/components/primitives/CustomMedia";
import { CustomSection } from "@/components/primitives/CustomSection";
import type { Demo } from "@/content";

/**
 * One demo in full, as its own section of /demos: the context on the left and
 * the recording beside it, at the phone's own proportions so the screen reads
 * as a phone. On a phone the words come first and the recording follows.
 *
 * The thumbnail opens the recording in a dialog rather than playing in place,
 * because at this width the burned-in captions are too small to read; the
 * dialog plays it as tall as the screen allows.
 */
export function DemoDetail({ demo }: { demo: Demo }) {
  return (
    <CustomSection id={demo.id} title={demo.title}>
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-3 text-lede text-ink-muted">
          {demo.context.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          {demo.points ? (
            <ol className="list-decimal space-y-3 pl-5">
              {demo.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ol>
          ) : null}
        </div>

        <div className="w-44 shrink-0 md:w-52">
          <CustomMedia
            shape="natural"
            src={demo.poster}
            video={demo.video}
            alt={demo.alt}
          />
        </div>
      </div>
    </CustomSection>
  );
}
