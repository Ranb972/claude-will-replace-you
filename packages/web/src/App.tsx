import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ResultPage } from "./pages/ResultPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/result/:id" element={<ResultPage />} />
        {/* Other routes will be added by other layers */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
              <p>Claude Will Replace You — Coming Soon</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
