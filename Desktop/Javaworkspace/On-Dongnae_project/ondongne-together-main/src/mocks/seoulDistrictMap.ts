/**
 * 서울시 25개 구 — 단순화된 SVG 좌표 (mock 그리드 레이아웃)
 * 추후 실제 GeoJSON/TopoJSON 경계 데이터로 교체 예정
 *
 * 각 구를 5×5 그리드 셀로 표현하여 대략적인 서울 지리 배치를 모사
 * col: 0(서쪽)→4(동쪽), row: 0(북쪽)→4(남쪽)
 */

export interface MockDistrictCell {
  district: string;
  col: number; // 0-4
  row: number; // 0-4
}

// 서울시 구 배치를 대략적 지리 기반으로 5×5 그리드에 매핑
export const seoulDistrictGrid: MockDistrictCell[] = [
  // row 0 (최북단)
  { district: '도봉구', col: 3, row: 0 },
  { district: '강북구', col: 2, row: 0 },
  { district: '노원구', col: 4, row: 0 },

  // row 1
  { district: '은평구', col: 0, row: 1 },
  { district: '종로구', col: 1, row: 1 },
  { district: '성북구', col: 2, row: 1 },
  { district: '동대문구', col: 3, row: 1 },
  { district: '중랑구', col: 4, row: 1 },

  // row 2
  { district: '서대문구', col: 0, row: 2 },
  { district: '마포구', col: 0, row: 2.6 },
  { district: '중구', col: 1, row: 2 },
  { district: '용산구', col: 1, row: 2.6 },
  { district: '성동구', col: 2, row: 2 },
  { district: '광진구', col: 3, row: 2 },
  { district: '강동구', col: 4, row: 2.3 },

  // row 3
  { district: '강서구', col: 0, row: 3.3 },
  { district: '양천구', col: 0.8, row: 3.5 },
  { district: '영등포구', col: 1, row: 3 },
  { district: '동작구', col: 2, row: 3 },
  { district: '관악구', col: 2, row: 3.7 },
  { district: '서초구', col: 3, row: 3 },
  { district: '송파구', col: 4, row: 3 },

  // row 4
  { district: '구로구', col: 0, row: 4 },
  { district: '금천구', col: 1, row: 4 },
  { district: '강남구', col: 3, row: 3.8 },
];
