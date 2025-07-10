import { useEffect, useState } from "react";
import axios from "axios";
import { FixedSizeList as List } from "react-window";

export default function TeamWmsTablePage() {
  const [type, setType] = useState("AR");
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const columnWidth = 160;
  const rowHeight = 35;
  const listHeight = 600;

  const fetchData = async (wmsType) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`http://127.0.0.1:8000/team-wms?type=${wmsType}`);
      setRows(res.data);
      if (res.data.length > 0) {
        setColumns(Object.keys(res.data[0]));
      }
    } catch {
      setError("❌ 데이터 로딩 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(type);
  }, [type]);

  const totalWidth = columns.length * columnWidth;

  const Row = ({ index, style }) => (
    <div
      className="flex border-b text-sm even:bg-gray-50"
      style={{ ...style, width: totalWidth }}
    >
      {columns.map((col, i) => (
        <div
          key={i}
          className="px-2 py-1 border-r truncate whitespace-nowrap overflow-hidden"
          style={{
            width: columnWidth,
            minWidth: columnWidth,
            maxWidth: columnWidth,
          }}
        >
          {rows[index][col]}
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">📋 팀 표준 WMS 테이블</h2>

      <div>
        <label className="font-semibold mr-2">WMS 분류 선택:</label>
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

      {loading && <p>🔄 로딩 중...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && rows.length > 0 && (
        <div className="border rounded overflow-x-auto" style={{ maxWidth: "100%" }}>
          {/* 가로폭 강제 고정 */}
          <div style={{ width: totalWidth }}>
            {/* 헤더 */}
            <div
              className="flex sticky top-0 z-10 bg-gray-100 text-xs font-semibold border-b"
              style={{ width: totalWidth }}
            >
              {columns.map((col, i) => (
                <div
                  key={i}
                  className="px-2 py-1 border-r truncate whitespace-nowrap overflow-hidden"
                  style={{
                    width: columnWidth,
                    minWidth: columnWidth,
                    maxWidth: columnWidth,
                  }}
                >
                  {col}
                </div>
              ))}
            </div>

            {/* 리스트 본문 */}
            <List
              height={listHeight}
              itemCount={rows.length}
              itemSize={rowHeight}
              width={totalWidth}
            >
              {Row}
            </List>
          </div>
        </div>
      )}
    </div>
  );
}
