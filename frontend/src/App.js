import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Landing from "./pages/Landing";
import AdminPanel from "./pages/AdminPanel";

export const ADMIN_PATH = "/tba-control-x7q2";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path={ADMIN_PATH} element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster
        position="top-center"
        theme="dark"
        toastOptions={{ style: { background: "#111", border: "1px solid rgba(255,32,32,0.4)", color: "#fff" } }}
      />
    </BrowserRouter>
  );
}

export default App;
