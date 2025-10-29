import * as React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: DivProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-zinc-900/60 shadow-sm ${
        className || ""
      }`}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: DivProps) {
  return (
    <div
      className={`p-6 pb-4 border-b border-gray-100 dark:border-gray-800 ${
        className || ""
      }`}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: DivProps) {
  return (
    <div
      className={`text-2xl md:text-3xl font-bold tracking-tight ${className || ""}`}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: DivProps) {
  return (
    <div className={`p-6 ${className || ""}`} {...props} />
  );
}

export function CardFooter({ className, ...props }: DivProps) {
  return (
    <div
      className={`p-6 pt-0 border-t border-gray-100 dark:border-gray-800 ${
        className || ""
      }`}
      {...props}
    />
  );
}


