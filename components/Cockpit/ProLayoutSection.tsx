import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  children: ReactNode;
};

export function ProLayoutSection({ title, subtitle, rightSlot, children }: Props) {
  return (
    <section className="mb-8 rounded-2xl border border-neutral-900 bg-neutral-950/60 p-4 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-blue-300">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-xs text-neutral-400 max-w-lg">
              {subtitle}
            </p>
          )}
        </div>
        {rightSlot && <div className="shrink-0">{rightSlot}</div>}
      </div>
      {children}
    </section>
  );
}
