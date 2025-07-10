import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProjectSelector from "./components/ProjectSelector";
import NodeListPage from "./pages/NodeListPage";
import TeamAdminPage from "./pages/TeamAdminPage"; // 추가
import TeamWmsTablePage from "./pages/TeamWmsTablePage"; // ✅ 추가

function App() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <BrowserRouter>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">🌐 BNote Cloud</h1>

        <nav className="mb-6 flex gap-4">
          <Link to="/" className="text-blue-600 underline">프로젝트 뷰</Link>
          <Link to="/team-admin" className="text-blue-600 underline">팀 어드민</Link>
          <Link to="/team-wms" className="text-blue-600 underline">팀 표준 테이블</Link> {/* ✅ 추가 */}
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <ProjectSelector onSelect={setSelectedProject} />
                {selectedProject && <NodeListPage project={selectedProject} />}
              </>
            }
          />
          <Route path="/team-admin" element={<TeamAdminPage />} />
          <Route path="/team-wms" element={<TeamWmsTablePage />} /> {/* ✅ 추가 */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
