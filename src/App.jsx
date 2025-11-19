import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobePage from "./pages/GlobePage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GlobePage />} />
      </Routes>
    </BrowserRouter>
  );
}
