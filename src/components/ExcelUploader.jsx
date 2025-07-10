import { useState } from "react";
import axios from "axios";

export default function ExcelUploader() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const upload = async () => {
    if (!file) return alert("파일을 선택하세요.");
    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("업로드 중...");
      const res = await axios.post("http://127.0.0.1:8000/upload-wms-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus(`✅ 완료 (${res.data.rows}행 삽입됨)`);
    } catch (err) {
      setStatus("❌ 실패: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="border rounded p-4 bg-white shadow w-fit">
      <h3 className="font-semibold mb-2">📦 WMs Excel 업로드</h3>
      <input type="file" accept=".xlsx" onChange={e => setFile(e.target.files[0])} />
      <button onClick={upload} className="mt-2 px-4 py-1 bg-blue-600 text-white rounded">
        업로드
      </button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
}
