import { cx } from "@/utils/all";

export default function Label(props) {
  const margin = props.nomargin;

  if (props.pill) {
    return (
      <div
        className={
          "inline-flex items-center justify-center font-bold px-2 h-6 text-sm bg-ink/5 text-ink rounded-full shrink-0 dark:bg-white/10 dark:text-white"
        }>
        {props.children}
      </div>
    );
  }

  return (
    <span
      className={cx(
        "inline-block font-mono text-[10px] tracking-[0.18em] uppercase text-ink/70 dark:text-white/70",
        !margin && " mt-5"
      )}>
      {props.children}
    </span>
  );
}
