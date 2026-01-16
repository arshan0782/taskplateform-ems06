import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import PageWrapper from "../../components/layout/PageWrapper";
import formatDate from "../../components/utils/formatDate";
import Loader from "../../components/common/Loader";

/*  DATE FILTER HELPER */
const isWithinDays = (date, days) => {
  if (!days) return true; // show all by default
  const now = new Date();
  const past = new Date();
  past.setDate(now.getDate() - days);
  return new Date(date) >= past;
};

const ITEMS_PER_PAGE = 5;

const ActivityLog = () => {
  const [allLogs, setAllLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [days, setDays] = useState(null); 
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    api
      .get("/activity/get-logs")
      .then((res) => setAllLogs(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  /*  FILTER + SEARCH */
  const filteredLogs = useMemo(() => {
    return allLogs
      .filter((log) => isWithinDays(log.createdAt, days))
      .filter((log) => {
        const q = search.toLowerCase();
        return (
          log.action?.toLowerCase().includes(q) ||
          log.feedback?.toLowerCase().includes(q) ||
          log.user?.name?.toLowerCase().includes(q)
        );
      });
  }, [allLogs, days, search]);

  /* PAGINATION */
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = filteredLogs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <PageWrapper>
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Activity Logs
        </h2>
        <p className="text-sm text-gray-500">
          View and track system activities
        </p>
      </div>

      {/* CONTROLS */}
      <div className="bg-white border rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        {/* LEFT CONTROLS */}
        <div className="flex gap-3 items-center">
          {/* DROPDOWN */}
          <select
            value={days ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              setDays(value ? Number(value) : null);
              setPage(1);
            }}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="">All Activity</option>
            <option value={7}>Last 7 days</option>
            <option value={15}>Last 15 days</option>
            <option value={30}>Last 30 days</option>
          </select>

          {/* SHOW ALL BUTTON */}
          <button
            onClick={() => {
              setDays(null);
              setSearch("");
              setPage(1);
            }}
            className="text-sm px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
          >
            Show All Activity
          </button>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by user, action or feedback..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border rounded px-3 py-2 text-sm w-full md:w-72"
        />
      </div>

      {/* LOADER */}
      {loading && <Loader />}

      {/* EMPTY STATE */}
      {!loading && filteredLogs.length === 0 && (
        <div className="bg-white border rounded-lg p-6 text-center text-gray-500">
          No activity found
        </div>
      )}

      {/* LOG LIST */}
      {!loading && paginatedLogs.length > 0 && (
        <div className="space-y-4">
          {paginatedLogs.map((log) => (
            <div
              key={log._id}
              className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              {/* ACTION */}
              <p className="font-semibold text-teal-700 text-lg">
                {log.action}
              </p>

              {/* FEEDBACK */}
              {log.feedback && (
                <p className="text-sm text-gray-600 mt-1">
                  {log.feedback}
                </p>
              )}

              {/* META */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 text-sm text-gray-500">
                <p>
                  Performed by:{" "}
                  <span className="font-medium text-gray-700">
                    {log.user?.name || "System"}
                  </span>
                </p>
                <p className="text-xs">
                  {formatDate(log.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded text-sm ${
                page === i + 1
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default ActivityLog;
