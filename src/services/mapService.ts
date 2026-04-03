import { rankingService } from "./rankingService";
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
    const rankings = await rankingService.getDistrictRankings();

    const scoreData = rankings.map((d) => ({
      district: d.district,
      score: d.averageTemperature, 
    }));

    const colorMap = buildDistrictScoreColorMap(scoreData);

    return seoulDistrictGrid.map((cell: MockDistrictCell) => {
      const ranking = rankings.find(
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