export async function getDistrictScoreData() {
  const response = await fetch("http://localhost:8080/api/score");

  if (!response.ok) {
    throw new Error(`API 호출 실패: ${response.status}`);
  }

  return response.json();
}