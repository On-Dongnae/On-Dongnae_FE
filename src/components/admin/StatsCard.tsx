import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: 'default' | 'amber' | 'green' | 'red' | 'blue';
}

const variantStyles = {
  default: 'bg-card border-border',
  amber: 'bg-admin-amber-light border-admin-amber/20',
  green: 'bg-admin-green-light border-admin-green/20',
  red: 'bg-admin-red-light border-admin-red/20',
  blue: 'bg-admin-blue-light border-admin-blue/20',
};

const iconStyles = {
  default: 'text-muted-foreground',
  amber: 'text-admin-amber',
  green: 'text-admin-green',
  red: 'text-admin-red',
  blue: 'text-admin-blue',
};

export default function StatsCard({ label, value, icon: Icon, trend, variant = 'default' }: StatsCardProps) {
  return (
    <div className={`rounded-lg border px-5 py-4 ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className={`h-[18px] w-[18px] ${iconStyles[variant]}`} />
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
    </div>
  );
}
