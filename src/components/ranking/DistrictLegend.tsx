const legendColors = [
  "#FBE7CC",
  "#F6D7A9",
  "#E8B47B",
  "#E29A50",
  "#DB8024",
  "#CB6A27",
];

const DistrictLegend = () => {
  return (
    <div className="flex items-center gap-3 px-1">
      <span
        className="text-[12px] font-medium"
        style={{ color: "#8C8175" }}
      >
        낮음
      </span>

      <div className="flex-1 flex overflow-hidden rounded-full h-4 border"
        style={{ borderColor: "#E9E6E2" }}
      >
        {legendColors.map((color) => (
          <div
            key={color}
            className="flex-1"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <span
        className="text-[12px] font-medium"
        style={{ color: "#8C8175" }}
      >
        높음
      </span>
    </div>
  );
};

export default DistrictLegend;
