import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// 지도 구현 위해 leaflet 라이브러리 
import "leaflet/dist/leaflet.css";


createRoot(document.getElementById("root")!).render(<App />);
