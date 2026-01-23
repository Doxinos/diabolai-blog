import Link from "next/link";

export default function SidebarCta({ headline, body, buttonText, buttonUrl, variant = "primary" }) {
  if (!headline || !buttonText || !buttonUrl) {
    return null;
  }

  const isPrimary = variant === "primary";

  return (
    <div
      className={`rounded-lg p-5 ${
        isPrimary
          ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800"
          : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      }`}
    >
      <h3
        className={`text-lg font-semibold ${
          isPrimary
            ? "text-blue-900 dark:text-blue-100"
            : "text-gray-900 dark:text-gray-100"
        }`}
      >
        {headline}
      </h3>
      {body && (
        <p
          className={`mt-2 text-sm ${
            isPrimary
              ? "text-blue-700 dark:text-blue-300"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {body}
        </p>
      )}
      <Link
        href={buttonUrl}
        target={buttonUrl.startsWith("http") ? "_blank" : undefined}
        rel={buttonUrl.startsWith("http") ? "noopener noreferrer" : undefined}
        className={`mt-4 inline-block rounded-md px-4 py-2 text-sm font-medium transition-colors ${
          isPrimary
            ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            : "bg-gray-700 text-white hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500"
        }`}
      >
        {buttonText} &rarr;
      </Link>
    </div>
  );
}
