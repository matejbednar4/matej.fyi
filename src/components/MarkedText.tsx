/**
 * Work copy with its marked phrases set apart. The copy marks a stack name, or
 * the phrase built around one, with `**double asterisks**`, and that one
 * convention is all that is read here: nothing else from Markdown. The marked
 * words are set in `<b>`, HTML's element for a product name in running text,
 * in the heading colour and a heavier weight, so a reader skimming sees what
 * the work was built with.
 *
 * Marked by hand rather than matched from the stack list, because the phrase
 * worth marking is often longer than the name: "Stripe webhook handling".
 * Drawn wherever work copy is: a work item in full, and a highlight's summary.
 */
export function MarkedText({ text }: { text: string }) {
  return (
    <>
      {text.split("**").map((part, index) =>
        index % 2 === 1 ? (
          <b key={index} className="font-semibold text-ink">
            {part}
          </b>
        ) : (
          part
        ),
      )}
    </>
  );
}
