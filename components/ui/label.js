import { cx } from "@/utils/all";

export default function Label(props) {
  const margin = props.nomargin;

  if (props.pill) {
    return (
      <div
        className={
          "inline-flex items-center justify-center font-bold px-2 h-6 text-sm bg-blue-50 text-blue-500 rounded-full shrink-0 dark:bg-gray-800 dark:text-gray-300"
        }>
        {props.children}
      </div>
    );
  }

  return (
    <span
      className={cx(
        "inline-block text-xs font-medium tracking-wider uppercase text-gray-500 dark:text-gray-400",
        !margin && " mt-5"
      )}>
      {props.children}
    </span>
  );
}
