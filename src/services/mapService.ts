import { districtRankings } from '@/mocks/rankings';
import { seoulDistrictGrid, MockDistrictCell } from '@/mocks/seoulDistrictMap';
import { DistrictRanking } from '@/types';
import { buildDistrictColorMap } from '@/lib/mapColors';

export interface DistrictMapDatum {
  district: string;
  rank: number;
  temperature: number;
  fillColor: string;
  col: number;
  row: number;
}

// TODO: 추후 실제 GeoJSON fetch로 교체
export const mapService = {
  /** 25개 구 온도 지도 데이터 반환 */
  getDistrictMapData: async (): Promise<DistrictMapDatum[]> => {
    await new Promise(r => setTimeout(r, 300));

    const colorMap = buildDistrictColorMap(districtRankings);

    return seoulDistrictGrid.map((cell: MockDistrictCell) => {
      const ranking: DistrictRanking | undefined = districtRankings.find(
        d => d.district === cell.district
      );
      return {
        district: cell.district,
        rank: ranking?.rank ?? 0,
        temperature: ranking?.averageTemperature ?? 0,
        fillColor: colorMap.get(cell.district) ?? '#f5e6e0',
        col: cell.col,
        row: cell.row,
      };
    });
  },
};
