import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/common/PageHeader';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import DistrictTemperatureMap from '@/components/ranking/DistrictTemperatureMap';
import DistrictLegend from '@/components/ranking/DistrictLegend';
import DistrictInfoCard from '@/components/ranking/DistrictInfoCard';
import { mapService, DistrictMapDatum } from '@/services/mapService';
import { authService } from '@/services/authService';

const RankingMapPage = () => {
  const [data, setData] = useState<DistrictMapDatum[]>([]);
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();
  const [selected, setSelected] = useState<string>(user.district);

  useEffect(() => {
    mapService.getDistrictMapData().then(d => {
      setData(d);
      setLoading(false);
    });
  }, []);

  const selectedData = data.find(d => d.district === selected) ?? null;
  const isMyDistrict = selected === user.district;

  return (
    <AppLayout>
      <PageHeader title="동네 온도 지도" showBack />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="px-4 py-3 space-y-3 animate-fade-in pb-24">
          <p className="text-[12px] text-muted-foreground text-center">
            서울시 25개 구의 평균 온도를 한눈에 확인해보세요
          </p>
        
          {/* 지도 */}
          <DistrictTemperatureMap
            data={data}
            selectedDistrict={selected}
            onSelect={setSelected}
          />
          

          {/* 범례 */}
          <DistrictLegend />

          {/* 선택된 구 정보 */}
          <DistrictInfoCard data={selectedData} isMyDistrict={isMyDistrict} />

          {/* 내 동네 보기 버튼 */}
          {!isMyDistrict && (
            <button
              onClick={() => setSelected(user.district)}
              className="w-full text-[12px] text-primary font-semibold py-2 rounded-lg bg-primary/5 active:bg-primary/10 transition-colors"
            >
              내 동네 보기
            </button>
          )}
        </div>
      )}
    </AppLayout>
  );
};

export default RankingMapPage;
