interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'default';
  children: React.ReactNode;
}

const variantStyles = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  default: 'bg-gray-100 text-gray-700',
};

export function Badge({ variant = 'default', children }: BadgeProps) {
  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${variantStyles[variant]}`}>
      {children}
    </span>
  );
}
