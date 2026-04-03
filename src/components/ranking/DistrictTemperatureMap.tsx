import { DistrictMapDatum } from '@/services/mapService';
import { cn } from '@/lib/utils';

interface Props {
  data: DistrictMapDatum[];
  selectedDistrict: string | null;
  onSelect: (district: string) => void;
}

/**
 * 서울시 25개 구 mock 그리드 지도
 * TODO: 추후 실제 GeoJSON/SVG path 기반 지도로 교체
 * 교체 시 이 컴포넌트만 변경하면 됨 (props 인터페이스 유지)
 */
const DistrictTemperatureMap = ({ data, selectedDistrict, onSelect }: Props) => {
  // 그리드 범위 계산
  const maxCol = Math.max(...data.map(d => d.col));
  const maxRow = Math.max(...data.map(d => d.row));

  const cellW = 100 / (maxCol + 1.8);
  const cellH = 100 / (maxRow + 1.8);

  return (
    <div className="bg-card rounded-xl shadow-card p-3 relative" style={{ aspectRatio: '1.15' }}>
      {/* SVG 기반 그리드 맵 */}
      <svg viewBox="0 0 400 370" className="w-full h-full">
        {data.map(d => {
          const x = 20 + (d.col / (maxCol + 0.6)) * 350;
          const y = 15 + (d.row / (maxRow + 0.6)) * 320;
          const isSelected = selectedDistrict === d.district;
          const w = 68;
          const h = 55;

          return (
            <g
              key={d.district}
              onClick={() => onSelect(d.district)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx={8}
                fill={d.fillColor}
                stroke={isSelected ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.6)'}
                strokeWidth={isSelected ? 2.5 : 1}
                className="transition-all duration-200"
                style={{
                  filter: isSelected ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))' : undefined,
                }}
              />
              <text
                x={x + w / 2}
                y={y + h / 2 - 4}
                textAnchor="middle"
                dominantBaseline="middle"
                className="pointer-events-none select-none"
                fill={isSelected ? 'hsl(var(--primary))' : '#555'}
                fontSize={isSelected ? 11 : 10}
                fontWeight={isSelected ? 700 : 500}
              >
                {d.district.replace('구', '')}
              </text>
              <text
                x={x + w / 2}
                y={y + h / 2 + 12}
                textAnchor="middle"
                dominantBaseline="middle"
                className="pointer-events-none select-none"
                fill={isSelected ? 'hsl(var(--primary))' : '#888'}
                fontSize={9}
                fontWeight={isSelected ? 600 : 400}
              >
                {d.temperature}°C
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default DistrictTemperatureMap;
