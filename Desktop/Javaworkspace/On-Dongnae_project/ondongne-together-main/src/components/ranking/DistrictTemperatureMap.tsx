import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import proj4 from "proj4";
import { DistrictMapDatum } from "@/services/mapService";

// 색상 상수 정의
const MAP_UI = {
  borderDefault: "#FFFFFF",
  borderHover: "#CE593B",   // 코랄
  borderSelected: "#DB8024", // 메인 주황
};

interface Props {
  data: DistrictMapDatum[];
  selectedDistrict: string | null;
  onSelect: (district: string) => void;
}

proj4.defs(
  "EPSG:5179",
  "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs"
);

function convertCoords(coords: any): any {
  if (typeof coords[0] === "number") {
    const [x, y] = coords;
    const [lng, lat] = proj4("EPSG:5179", "EPSG:4326", [x, y]);
    return [lng, lat];
  }
  return coords.map(convertCoords);
}

function convertGeoJSON(data: any) {
  return {
    ...data,
    features: data.features.map((feature: any) => ({
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates: convertCoords(feature.geometry.coordinates),
      },
    })),
  };
}

const DistrictTemperatureMap = ({ data, selectedDistrict, onSelect }: Props) => {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    const loadGeoData = async () => {
      try {
        const res = await fetch("/seoul.gu.json");
        const raw = await res.json();
        const converted = convertGeoJSON(raw);
        setGeoData(converted);
      } catch (error) {
        console.error("GeoJSON 불러오기 실패:", error);
      }
    };

    loadGeoData();
  }, []);

  const style = (feature: any) => {
    const districtName = feature.properties.title;
    const districtData = data.find((d) => d.district === districtName);
    const isSelected = selectedDistrict === districtName;


    return {
      fillColor: districtData?.fillColor ?? "#FBE7CC",
      weight: isSelected ? 3.2 : 1.4,
      color: isSelected ? MAP_UI.borderSelected : MAP_UI.borderDefault,
      fillOpacity: isSelected ? 0.95 : 0.8,
    };
    
  };

  const onEachFeature = (feature: any, layer: any) => {
  const districtName = feature.properties.title;
  const districtData = data.find((d) => d.district === districtName);

  layer.bindPopup(`
    <div style="font-size: 14px; line-height: 1.6; color: #2F2A25;">
      <strong style="color: #DB8024;">${districtName}</strong><br/>
      온도: ${districtData?.temperature ?? "-"}°C<br/>
      순위: ${districtData?.rank ?? "-"}위
    </div>
  `);

    layer.on({
      click: () => {
        onSelect(districtName);
      },
      mouseover: (e: any) => {
        e.target.setStyle({
          weight: 3,
          fillOpacity: 0.95,
        });
      },
      mouseout: (e: any) => {
        const isSelected = selectedDistrict === districtName;
        e.target.setStyle({
          weight: isSelected ? 3 : 1.2,
          fillOpacity: isSelected ? 0.9 : 0.75,
        });
      },
    });
  };

  return (
    <div
      className="bg-card rounded-xl shadow-card overflow-hidden relative"
      style={{ aspectRatio: "1.15" }}
    >
      <MapContainer
        center={[37.5665, 126.978]}
        zoom={11}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoData && (
          <GeoJSON
            data={geoData}
            style={style}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default DistrictTemperatureMap;