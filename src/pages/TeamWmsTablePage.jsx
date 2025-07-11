import { useEffect, useState, useCallback, useRef, forwardRef } from "react";
import axios from "axios";
import { FixedSizeGrid as Grid } from "react-window";

const columnWidth = 160;
const rowHeight = 35;
const listHeight = 600;

// Grid 내에서만 가로/세로 스크롤
const OuterElement = forwardRef(({ style, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    style={{
      ...style,
      overflowX: "auto",
      overflowY: "auto",
    }}
  />
));

export default function TeamWmsTablePage() {
  const [type, setType] = useState("AR");
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const headerRef = useRef(null);
  const gridOuterRef = useRef(null);

  const fetchData = async (wmsType) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`http://127.0.0.1:8000/team-wms?type=${wmsType}`);
      setRows(res.data);
      if (res.data.length > 0) setColumns(Object.keys(res.data[0]));
    } catch {
      setError("❌ 데이터 로딩 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(type);
  }, [type]);

  const filteredRows = filter
    ? rows.filter((r) =>
        columns.some((col) =>
          String(r[col] || "").toLowerCase().includes(filter.toLowerCase())
        )
      )
    : rows;

  const totalWidth = columns.length * columnWidth;

  const Cell = useCallback(
    ({ columnIndex, rowIndex, style }) => {
      const row = filteredRows[rowIndex] || {};
      const col = columns[columnIndex];
      const value = row[col] ?? "";
      const isMatch = filter && String(value).toLowerCase().includes(filter.toLowerCase());
      return (
        <div
          className={`px-2 py-[7px] border border-gray-200 truncate whitespace-nowrap overflow-hidden text-sm ${
            isMatch
              ? "bg-amber-50 text-blue-800"
              : rowIndex % 2 === 0
              ? "bg-white"
              : "bg-gray-50"
          }`}
          style={{ ...style, boxSizing: "border-box" }}
        >
          {value}
        </div>
      );
    },
    [filteredRows, columns, filter]
  );

  // Grid 스크롤에 맞춰 헤더 스크롤 동기화
  useEffect(() => {
    const gridContainer = gridOuterRef.current;
    const header = headerRef.current;
    if (!gridContainer || !header) return;
    const sync = () => {
      header.scrollLeft = gridContainer.scrollLeft;
    };
    gridContainer.addEventListener("scroll", sync);
    return () => gridContainer.removeEventListener("scroll", sync);
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">📋 팀 표준 WMS 테이블</h2>
      <div className="flex flex-wrap items-center gap-4">
        <label className="font-semibold">WMS 분류:</label>
        <select
          className="border px-2 py-1 rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="AR">AR (건축)</option>
          <option value="SS">SS (구조)</option>
          <option value="FP">FP (소방)</option>
        </select>
        <input
          placeholder="🔍 필터 (작업명 등)"
          className="border px-2 py-1 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {loading && <p>🔄 로딩 중...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && filteredRows.length > 0 && (
        <div className="border rounded overflow-x-auto" style={{ width: '100%' }}>
          <div style={{ width: totalWidth }}>
            <div
              ref={headerRef}
              className="bg-gray-100 text-xs font-semibold border-b"
              style={{
                width: totalWidth,
                height: rowHeight,
                display: 'flex',
                boxSizing: 'border-box',
                overflow: 'hidden'
              }}
            >
              {columns.map((col, i) => (
                <div
                  key={i}
                  className="px-2 py-[7px] border-r truncate whitespace-nowrap overflow-hidden"
                  style={{
                    width: columnWidth,
                    minWidth: columnWidth,
                    maxWidth: columnWidth,
                    boxSizing: 'border-box',
                  }}
                >
                  {col}
                </div>
              ))}
            </div>

            <Grid
              columnCount={columns.length}
              rowCount={filteredRows.length}
              columnWidth={columnWidth}
              rowHeight={rowHeight}
              width={totalWidth}
              height={listHeight - rowHeight}
              outerRef={gridOuterRef}
              outerElementType={OuterElement}
            >
              {Cell}
            </Grid>
          </div>
        </div>
      )}
    </div>
  );
}
