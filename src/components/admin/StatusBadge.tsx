type StatusVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'info';

interface StatusBadgeProps {
  label: string;
  variant: StatusVariant;
}

const styles: Record<StatusVariant, string> = {
  success: 'bg-admin-green-light text-admin-green',
  warning: 'bg-admin-amber-light text-admin-amber',
  danger: 'bg-admin-red-light text-admin-red',
  neutral: 'bg-muted text-muted-foreground',
  info: 'bg-admin-blue-light text-admin-blue',
};

export default function StatusBadge({ label, variant }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${styles[variant]}`}>
      {label}
    </span>
  );
}
