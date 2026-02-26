import { cx } from "@/utils/all";

export default function Label(props) {
  const margin = props.nomargin;

  if (props.pill) {
    return (
      <div
        className={
          "inline-flex items-center justify-center font-bold px-2 h-6 text-sm bg-orange/10 text-orange rounded-full shrink-0 dark:bg-orange/10 dark:text-orange"
        }>
        {props.children}
      </div>
    );
  }

  return (
    <span
      className={cx(
        "inline-block font-mono text-[10px] tracking-[0.18em] uppercase text-orange dark:text-orange",
        !margin && " mt-5"
      )}>
      {props.children}
    </span>
  );
}
