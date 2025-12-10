import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import Home from "./pages/Home";
import GlobePageDeck from "./pages/GlobePageDeck";
import Globe3D from "./pages/Globe3D";
import Globe4D from "./pages/Globe4D";


export default function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/globe" element={<GlobePageDeck />} />
          <Route path="/globe3d" element={<Globe3D />} />
          <Route path="/globe4d" element={<Globe4D />} />
        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
  );
}
