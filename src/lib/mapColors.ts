/**
 * 동네 온도 지도 색상 유틸
 * 온도가 높을수록 진한 warm red, 낮을수록 연한 warm red
 */

/** 온도 범위에 따라 0~1 비율을 반환 */
export const normalizeTemp = (temp: number, min: number, max: number): number => {
  if (max === min) return 0.5;
  return (temp - min) / (max - min);
};

/**
 * 온도 비율(0~1)을 HSL 색상으로 변환
 * 연한 peach(낮은 온도) → 진한 warm red(높은 온도)
 */
export const getHeatColor = (ratio: number): string => {
  // hue: 15(warm red) ~ 25(peach)
  const hue = 25 - ratio * 10;
  // saturation: 40% ~ 85%
  const sat = 40 + ratio * 45;
  // lightness: 88%(연한) ~ 48%(진한)
  const light = 88 - ratio * 40;
  return `hsl(${Math.round(hue)}, ${Math.round(sat)}%, ${Math.round(light)}%)`;
};

/** districtRankings 배열에서 색상 매핑 생성 */
export const buildDistrictColorMap = (
  districts: { district: string; averageTemperature: number }[]
): Map<string, string> => {
  const temps = districts.map(d => d.averageTemperature);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const map = new Map<string, string>();
  districts.forEach(d => {
    const ratio = normalizeTemp(d.averageTemperature, min, max);
    map.set(d.district, getHeatColor(ratio));
  });
  return map;
};
