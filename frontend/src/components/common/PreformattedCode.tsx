import type { JSX, ReactNode } from "react";

export function PreformattedCode({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <pre className="p-4 rounded-2xl bg-gray-200 dark:bg-gray-600 select-all overflow-x-auto">
      <code>{children}</code>
    </pre>
  );
}
