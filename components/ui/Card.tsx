import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800/50 shadow-lg ${
        hover ? "hover:border-slate-700/50 transition-all" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function CardHeader({ children, icon, action }: CardHeaderProps) {
  return (
    <div className="p-6 border-b border-slate-800/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && <div className="text-amber-400">{icon}</div>}
          <h2 className="text-xl font-bold text-white">{children}</h2>
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
