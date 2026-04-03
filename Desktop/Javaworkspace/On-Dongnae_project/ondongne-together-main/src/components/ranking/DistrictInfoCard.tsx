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
    <div
      className="rounded-xl px-4 py-3.5"
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E9E6E2',
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <MapPin size={14} style={{ color: '#DB8024' }} />
        <span
          className="text-[13px] font-bold"
          style={{ color: '#2F2A25' }}
        >
          {data.district}
        </span>

        {isMyDistrict && (
          <span
            className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
            style={{
              backgroundColor: '#DB8024',
              color: '#FFFFFF',
            }}
          >
            내 동네
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span
          className="text-[12px]"
          style={{ color: '#7A6F63' }}
        >
          순위 <strong style={{ color: '#2F2A25' }}>{data.rank}위</strong> / 25
        </span>

        <span
          className="text-[15px] font-bold"
          style={{ color: '#DB8024' }}
        >
          {formatTemp(data.temperature)}
        </span>
      </div>
    </div>
  );
};

export default DistrictInfoCard;
