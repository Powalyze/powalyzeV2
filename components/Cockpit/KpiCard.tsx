interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color: 'blue' | 'yellow' | 'green' | 'red';
}

const colorClasses = {
  blue: 'bg-brand-accent/10 text-brand-accent',
  yellow: 'bg-status-yellow/10 text-status-yellow',
  green: 'bg-status-green/10 text-status-green',
  red: 'bg-status-red/10 text-status-red',
};

export default function KpiCard({ title, value, icon, trend, color }: KpiCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-white/10 hover:border-brand-gold/50 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-sm font-semibold ${trend.startsWith('+') ? 'text-status-green' : 'text-status-red'}`}>
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-white/70 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}
