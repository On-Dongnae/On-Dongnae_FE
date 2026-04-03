// 동네 온도 지도 색상 유틸
// 온도가 높을수록 진한 warm red, 낮을수록 연한 warm red


// 온도 범위에 따라 0~1 비율을 반환 
export const normalizeTemp = (temp: number, min: number, max: number): number => {
  if (max === min) return 0.5;
  return (temp - min) / (max - min);
};

//온도 비율(0~1)을 HSL 색상으로 변환
//연한 peach(낮은 온도) → 진한 warm red(높은 온도)

export const getHeatColor = (ratio: number): string => {
  // hue: 15(warm red) ~ 25(peach)
  const hue = 25 - ratio * 10;
  // saturation: 40% ~ 85%
  const sat = 40 + ratio * 45;
  // lightness: 88%(연한) ~ 48%(진한)
  const light = 88 - ratio * 40;
  return `hsl(${Math.round(hue)}, ${Math.round(sat)}%, ${Math.round(light)}%)`;
};


// 점수용 6단계 색상
// 낮음 점수(연한색) => 높은 점수(진한색)
export const SCORE_COLOR_STEPS = [
  "#FBE7CC", // 0단계 - 가장 연한 색
  "#F6D7A9",
  "#E8B47B",
  "#E29A50",
  "#DB8024",
  "#CB6A27", // 5단계 - 가장 진한 색
];

// 점수용 6단계 색상 변환
export const getScoreColor = (ratio: number): string => {
  const clamped = Math.max(0, Math.min(1, ratio));
  const index = Math.min(
    SCORE_COLOR_STEPS.length - 1,
    Math.floor(clamped * SCORE_COLOR_STEPS.length)
  );
  return SCORE_COLOR_STEPS[index];
};

// districtRankings 배열에서 온도 기준 색상 매핑 생성 
export const buildDistrictColorMap = (
  districts: { district: string; averageTemperature: number }[]
): Map<string, string> => {
  const temps = districts.map((d) => d.averageTemperature);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const map = new Map<string, string>();

  districts.forEach((d) => {
    const ratio = normalizeTemp(d.averageTemperature, min, max);
    map.set(d.district, getHeatColor(ratio));
  });

  return map;
};



// 점수 기준 6단계 색상 매핑
export const buildDistrictScoreColorMap = (
  districts: { district: string; score: number }[]
): Map<string, string> => {
  const scores = districts.map((d) => d.score);
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const map = new Map<string, string>();

  districts.forEach((d) => {
    const ratio = normalizeTemp(d.score, min, max);
    map.set(d.district, getScoreColor(ratio));
  });

  return map;
};
