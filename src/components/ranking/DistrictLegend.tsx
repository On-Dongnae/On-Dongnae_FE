import { getHeatColor } from '@/lib/mapColors';

const DistrictLegend = () => {
  const steps = 6;
  const colors = Array.from({ length: steps }, (_, i) => getHeatColor(i / (steps - 1)));

  return (
    <div className="flex items-center gap-2 px-1">
      <span className="text-[10px] text-muted-foreground shrink-0">낮음</span>
      <div className="flex flex-1 h-3 rounded-full overflow-hidden">
        {colors.map((c, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>
      <span className="text-[10px] text-muted-foreground shrink-0">높음</span>
    </div>
  );
};

export default DistrictLegend;
