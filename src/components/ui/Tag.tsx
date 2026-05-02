interface TagProps {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'amber' | 'gray';
  onRemove?: () => void;
}

const colorStyles = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  amber: 'bg-amber-100 text-amber-700',
  gray: 'bg-gray-100 text-gray-700',
};

export function Tag({ children, color = 'gray', onRemove }: TagProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded ${colorStyles[color]}`}>
      {children}
      {onRemove && (
        <button onClick={onRemove} className="hover:text-red-500">×</button>
      )}
    </span>
  );
}
