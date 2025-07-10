import { useEffect, useState } from "react";
import axios from "axios";

export default function ProjectSelector({ onSelect }) {
  const [projects, setProjects] = useState([]);
  const [newName, setNewName] = useState("");

  const loadProjects = async () => {
    const res = await axios.get("http://127.0.0.1:8000/projects");
    setProjects(res.data);
  };

  const createProject = async () => {
    if (!newName) return;
    try {
      await axios.post("http://127.0.0.1:8000/projects", newName, {
        headers: { "Content-Type": "application/json" },
      });
      setNewName("");
      loadProjects();
    } catch (err) {
      alert(err.response?.data?.detail || "생성 실패");
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="mb-6">
      <div className="flex gap-4 mb-4">
        {projects.map((p) => (
          <button
            key={p}
            onClick={() => onSelect(p)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {p}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="새 프로젝트명"
          className="border px-2 py-1 rounded"
        />
        <button onClick={createProject} className="bg-green-600 text-white px-3 py-1 rounded">
          생성
        </button>
      </div>
    </div>
  );
}
