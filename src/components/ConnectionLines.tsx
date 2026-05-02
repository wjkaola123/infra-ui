import { useStore } from '../store/useStore';
import type { Relation, EntityType } from '../types';

interface CardPosition {
  id: string;
  type: EntityType;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ConnectionLinesProps {
  positions: Map<string, CardPosition>;
}

function getConnectionPoint(
  card: CardPosition,
  targetType: EntityType
): { x: number; y: number } {
  return {
    x: card.x + card.width,
    y: card.y + card.height / 2,
  };
}

function getTargetPoint(
  card: CardPosition,
  sourceType: EntityType
): { x: number; y: number } {
  return {
    x: card.x,
    y: card.y + card.height / 2,
  };
}

export function ConnectionLines({ positions }: ConnectionLinesProps) {
  const relations = useStore((s) => s.relations);

  const paths = relations
    .map((rel) => {
      const sourcePos = positions.get(`${rel.sourceType}-${rel.sourceId}`);
      const targetPos = positions.get(`${rel.targetType}-${rel.targetId}`);
      if (!sourcePos || !targetPos) return null;

      const source = getConnectionPoint(sourcePos, rel.targetType);
      const target = getTargetPoint(targetPos, rel.sourceType);

      const cpOffset = Math.min(80, Math.abs(target.x - source.x) / 2);
      const cp1x = source.x + cpOffset;
      const cp2x = target.x - cpOffset;

      return {
        id: rel.id,
        d: `M ${source.x} ${source.y} C ${cp1x} ${source.y}, ${cp2x} ${target.y}, ${target.x} ${target.y}`,
      };
    })
    .filter(Boolean) as { id: string; d: string }[];

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af" />
        </marker>
      </defs>
      {paths.map((path) => (
        <path
          key={path.id}
          d={path.d}
          fill="none"
          stroke="#9ca3af"
          strokeWidth="2"
          strokeDasharray="5,3"
          markerEnd="url(#arrowhead)"
          className="transition-all duration-300"
        />
      ))}
    </svg>
  );
}