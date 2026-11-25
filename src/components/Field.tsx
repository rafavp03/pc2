import type { ReactNode } from "react";

type Props = {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
};

export default function Field({ label, htmlFor, error, children }: Props) {
  return (
    <div className="mb-4">
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClass =
  "w-full rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none disabled:bg-slate-100";
