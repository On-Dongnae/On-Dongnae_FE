import { formatTemp } from '@/lib/temperature';
import { DistrictMapDatum } from '@/services/mapService';
import { MapPin } from 'lucide-react';

interface Props {
  data: DistrictMapDatum | null;
  isMyDistrict?: boolean;
}

const DistrictInfoCard = ({ data, isMyDistrict }: Props) => {
  if (!data) return null;

  return (
    <div className={`rounded-xl px-4 py-3.5 ${isMyDistrict ? 'bg-primary/10 ring-1 ring-primary/30' : 'bg-card shadow-card'}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <MapPin size={14} className="text-primary" />
        <span className="text-[13px] font-bold text-foreground">{data.district}</span>
        {isMyDistrict && (
          <span className="text-[9px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-semibold">내 동네</span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-muted-foreground">순위 <strong className="text-foreground">{data.rank}위</strong> / 25</span>
        <span className="text-[15px] font-bold text-primary">{formatTemp(data.temperature)}</span>
      </div>
    </div>
  );
};

export default DistrictInfoCard;
