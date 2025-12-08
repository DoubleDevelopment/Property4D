import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import Home from "./pages/Home";
import GlobePage from "./pages/GlobePage";


export default function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/globe" element={<GlobePage />} />
        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
  );
}
