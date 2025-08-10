"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TagStat {
  no: number;
  tag: string;
  numberOfTestCasesPublished: number;
  popularity: string;
}

interface TrimesterStats {
  labels: string[];
  data: number[];
}

const UseCaseInsights: React.FC = () => {
  const [tags, setTags] = useState<TagStat[]>([]);
  const [totalTags, setTotalTags] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [trimesterStats, setTrimesterStats] = useState<TrimesterStats>({
    labels: [],
    data: [],
  });
  const [trimesterFilter, setTrimesterFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");
  const [filteredCount, setFilteredCount] = useState(0);
  const t = useTranslations("statistics");

  useEffect(() => {
    fetchTags();
  }, [page, limit, search]);

  useEffect(() => {
    fetchTrimesterStats();
  }, []);

  useEffect(() => {
    fetchFilteredCount();
  }, [trimesterFilter, tagFilter]);

  const fetchTags = async () => {
    try {
      const res = await fetch(
        `/api/statistics/tags?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`
      );
      if (!res.ok) return;
      const json = await res.json();
      setTags(json.data);
      setTotalTags(json.total);
    } catch (err) {
      console.error("Failed to fetch tag stats", err);
    }
  };

  const fetchTrimesterStats = async () => {
    try {
      const res = await fetch("/api/statistics/trimester");
      if (!res.ok) return;
      const json = await res.json();
      setTrimesterStats(json);
    } catch (err) {
      console.error("Failed to fetch trimester stats", err);
    }
  };

  const fetchFilteredCount = async () => {
    try {
      const res = await fetch(
        `/api/statistics/count?trimester=${encodeURIComponent(trimesterFilter)}&tag=${encodeURIComponent(tagFilter)}`
      );
      if (!res.ok) return;
      const json = await res.json();
      setFilteredCount(json.total);
    } catch (err) {
      console.error("Failed to fetch filtered count", err);
    }
  };

  const totalPages = Math.ceil(totalTags / limit);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white dark:bg-gray-900 shadow-lg h-96 p-6">
        <h4 className="mb-4 font-bold text-sm">{t("t1")}</h4>
        <Bar
          data={{
            labels: trimesterStats.labels,
            datasets: [
              {
                label: "Case Studies",
                data: trimesterStats.data,
                backgroundColor: "#3EB470",
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } },
          }}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <select
          value={trimesterFilter}
          onChange={(e) => setTrimesterFilter(e.target.value)}
          className="p-2 border shadow-lg bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
        >
          <option value="All">{t("All Trimesters")}</option>
          {trimesterStats.labels.map((label) => (
            <option key={label} value={label.replace("Trimester ", "T")}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="p-2 border shadow-lg bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
        >
          <option value="All">{t("All Tags")}</option>
          {tags.map((row) => (
            <option key={row.tag} value={row.tag}>
              {row.tag}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-center mb-4">
        <div className="w-full md:w-1/3 bg-white dark:bg-gray-900 shadow-xl py-8 px-10">
          <h2 className="text-2xl font-bold text-gray-400 dark:text-gray-200">
            {t("Total Results")}
          </h2>
          <p className="text-3xl font-bold text-center pt-4">{filteredCount}</p>
        </div>
      </div>

      <div className="overflow-x-auto px-4 py-2 bg-green-500 rounded-lg">
        <form className="flex items-center w-full" style={{ color: "black" }}>
          <input
            type="search"
            placeholder={t("Enter Tag name")}
            className="w-2/5 p-4 mr-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </form>
        <table className="min-w-full table-fixed divide-y divide-gray-200 bg-white">
          <thead className="bg-green-600">
            <tr>
              <th className="px-4 py-3 border-b-2 border-gray-200 bg-[#3EB470] text-center text-xl font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-100">
                {t("No")}
              </th>
              <th className="px-4 py-3 border-b-2 border-gray-200 bg-[#3EB470] text-center text-xl font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-100">
                {t("Tag")}
              </th>
              <th className="px-4 py-3 border-b-2 border-gray-200 bg-[#3EB470] text-center text-xl font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-100">
                {t("number")}
              </th>
              <th className="px-4 py-3 border-b-2 border-gray-200 bg-[#3EB470] text-center text-xl font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-100">
                {t("Popularity")}
              </th>
            </tr>
          </thead>
          <tbody>
            {tags.map((row, index) => (
              <tr
                key={row.tag}
                className={index % 2 !== 0 ? "bg-[#3EB470]" : "bg-white dark:bg-gray-800"}
              >
                <td className="px-5 py-5 border-b border-gray-200 text-lg text-center">
                  {row.no}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-lg text-center">
                  {row.tag}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-lg text-center">
                  {row.numberOfTestCasesPublished}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-lg text-center">
                  {row.popularity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav className="p-3 mt-5 flex justify-evenly items-center bg-[#3EB470] text-black dark:text-white">
        <p>
          {(page - 1) * limit + 1} - {Math.min(page * limit, totalTags)} of {totalTags}
        </p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className={`font-bold py-1 px-2 ${page === 1 ? "opacity-50" : "hover:underline"}`}
          >
            {"<"}
          </button>
          <span>Page {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className={`font-bold py-1 px-2 ${page === totalPages ? "opacity-50" : "hover:underline"}`}
          >
            {">"}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span>{t("Rows per page")}</span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(parseInt(e.target.value));
              setPage(1);
            }}
            className="p-2 border shadow-lg"
            style={{ color: "black" }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
        </div>
      </nav>
    </div>
  );
};

export default UseCaseInsights;

