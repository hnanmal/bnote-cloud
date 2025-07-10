import React, { useEffect, useState } from "react";
import axios from "axios";

export default function NodeListPage({ project }) {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    if (!project) return;
    axios
      .get(`http://127.0.0.1:8000/debug`, { params: { project } })
      .then((res) => setNodes(res.data));
  }, [project]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">📁 Project: {project}</h2>
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Path</th>
            <th className="border px-2 py-1">Values</th>
            <th className="border px-2 py-1">Locked By</th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((n) => (
            <tr key={n.id}>
              <td className="border px-2">{n.id}</td>
              <td className="border px-2">{n.name}</td>
              <td className="border px-2">{n.path.join(" > ")}</td>
              <td className="border px-2">
                {n.std_values.map((v) => (
                  <span key={v} className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs mr-1">
                    {v}
                  </span>
                ))}
              </td>
              <td className="border px-2">{n.locked_by ?? "🔓"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
