import React, { useState } from "react";
import axios from "axios";

export default function TeamAdminPage() {
  const [type, setType] = useState("AR");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file) {
      alert("엑셀 파일을 선택하세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/upload-wms-excel?type=${type}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setStatus(`✅ 업로드 성공 (${res.data.rows} rows)`);
    } catch (err) {
      console.error(err);
      setStatus(`❌ 실패: ${err.response?.data?.detail || err.message}`);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">🛠 팀 표준 관리 페이지</h2>

      <div className="space-y-2">
        <label className="block font-semibold">WMS 분류 선택</label>
        <select
          className="border px-2 py-1 rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="AR">AR (건축)</option>
          <option value="SS">SS (구조)</option>
          <option value="FP">FP (소방)</option>
        </select>
      </div>

      <div className="space-y-2">
      <label className="block font-semibold">엑셀 파일 업로드</label>

      <div className="flex items-center gap-4">
          <label
          htmlFor="fileInput"
          className="bg-gray-200 px-4 py-2 rounded cursor-pointer hover:bg-gray-300"
          >
          📁 파일 선택
          </label>
          <span className="text-sm text-gray-600">
          {file ? file.name : "선택된 파일 없음"}
          </span>
      </div>

      <input
          id="fileInput"
          type="file"
          accept=".xlsx"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
      />
      </div>

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        업로드
      </button>

      {status && <p className="mt-2">{status}</p>}
    </div>
  );
}
