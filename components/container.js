import { cx } from "@/utils/all";

export default function Container(props) {
  return (
    <div
      className={cx(
        "container mx-auto",
        props.large ? " max-w-screen-xl" : " max-w-screen-lg",
        props.full && "!max-w-full",
        !props.alt && "py-5 lg:py-8",
        props.className
      )}>
      {props.children}
    </div>
  );
}
