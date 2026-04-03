import { districtRankings } from "@/mocks/rankings";
import { seoulDistrictGrid, MockDistrictCell } from "@/mocks/seoulDistrictMap";
import { buildDistrictScoreColorMap } from "@/lib/mapColors";

export interface DistrictMapDatum {
  district: string;
  rank: number;
  temperature: number;
  fillColor: string;
  col: number;
  row: number;
}

export const mapService = {
  getDistrictMapData: async (): Promise<DistrictMapDatum[]> => {
    await new Promise((r) => setTimeout(r, 300));

    const scoreData = districtRankings.map((d) => ({
      district: d.district,
      score: 26 - d.rank, // 또는 실제 score 필드
    }));

    const colorMap = buildDistrictScoreColorMap(scoreData);

    return seoulDistrictGrid.map((cell: MockDistrictCell) => {
      const ranking = districtRankings.find(
        (d) => d.district === cell.district
      );

      return {
        district: cell.district,
        rank: ranking?.rank ?? 0,
        temperature: ranking?.averageTemperature ?? 0,
        fillColor: colorMap.get(cell.district) ?? "#d1d5db",
        col: cell.col,
        row: cell.row,
      };
    });
  },
};