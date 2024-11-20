"use client";

import React, { useState, useRef } from "react";
import { FaCheck, FaChevronDown, FaChevronUp } from "react-icons/fa";

type TableRow = {
  month: string;
  kWh: string | null; // Allow both string and null
  tonCO2eq: string | null; // Allow both string and null
};

export default function CFOCalculation() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editDropdown, setEditDropdown] = useState<number | null>(null); // Track which row's dropdown is open
  const dropdownRef = useRef<HTMLDivElement>(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Define table data with the correct type
  const [tableData, setTableData] = useState<TableRow[]>(
    months.map((month) => ({
      month,
      kWh: null, // Initially no data
      tonCO2eq: null, // Initially no data
    }))
  );

  const years = [2024, 2023, 2022, 2021];

  const handleYearClick = (year: number) => {
    setSelectedYear(year);
    setIsDropdownOpen(false);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
      setIsDropdownOpen(false);
    }
  };

  const handleFileImport = (index: number) => {
    // Mock the import file operation
    const newData = [...tableData];
    newData[index].kWh = "6,562"; // Mocked kWh value
    newData[index].tonCO2eq = "3.281"; // Mocked tonCO2eq value
    setTableData(newData);
    setEditDropdown(null); // Close the edit dropdown
  };

  const handleDeleteFile = (index: number) => {
    // Mock the delete operation
    const newData = [...tableData];
    newData[index].kWh = null; // Reset to null
    newData[index].tonCO2eq = null;
    setTableData(newData);
    setEditDropdown(null); // Close the edit dropdown
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      {/* Page Header */}
      <h1 className="text-3xl font-bold font-archivo text-center mb-8">
        CFO SCOPE 2 Calculation
      </h1>

      {/* Year Selector */}
      <div className="mb-6 flex justify-center">
        <div className="w-[290px]">
          <label
            htmlFor="year-select"
            className="font-inter block text-sm font-bold mb-2"
          >
            Select year
          </label>
          <div
            ref={dropdownRef}
            className="relative"
            tabIndex={0}
            onBlur={handleBlur}
          >
            <div
              id="year-select"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`cursor-pointer w-full px-4 py-2 border rounded-md text-sm flex justify-between items-center bg-white focus:outline-none focus:ring-1 focus:ring-[#559C2DFF] ${
                isDropdownOpen ? "ring-[#559C2DFF]" : ""
              }`}
            >
              {selectedYear}
              <span className="ml-2 text-gray-500">
                {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>

            {isDropdownOpen && (
              <ul className="absolute w-full mt-1 bg-white border rounded-md shadow-md text-sm z-10">
                {years.map((year) => (
                  <li
                    key={year}
                    onMouseDown={() => handleYearClick(year)}
                    className={`flex items-center justify-between px-4 py-2 cursor-pointer ${
                      selectedYear === year
                        ? "bg-[#F6FFF1] text-[#559C2DFF] font-medium"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {year}
                    {selectedYear === year && (
                      <FaCheck className="text-[#559C2DFF]" />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white shadow-md rounded-md overflow-hidden mb-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-sm font-light text-[#565E6CFF] font-archivo">
              <th className="px-4 py-5 text-left">Month</th>
              <th className="py-5 text-center">kWh</th>
              <th className="py-5 text-center">tonCO2eq</th>
              <th className="py-5 text-center">Electricity Bill file</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 text-sm`}
              >
                <td className="px-4 py-5 text-left font-semibold">
                  {row.month}
                </td>
                <td className="py-5 text-center">
                  {row.kWh || <span className="text-gray-500">-</span>}
                </td>
                <td className="py-5 text-center">
                  {row.tonCO2eq || <span className="text-gray-500">-</span>}
                </td>
                <td className="py-5 text-center relative">
                  {!row.kWh ? (
                    <button
                      onClick={() => handleFileImport(index)}
                      className="bg-[#559C2DFF] text-white px-4 py-2 rounded-md hover:bg-[#37631DFF]"
                    >
                      Import File
                    </button>
                  ) : (
                    <div>
                      <button
                        onClick={() =>
                          setEditDropdown(editDropdown === index ? null : index)
                        }
                        className="text-green-600"
                      >
                        Edit
                      </button>
                      {editDropdown === index && (
                        <ul className="absolute right-0 top-5 bg-white border rounded-md shadow-md text-sm z-10 text-left">
                          <li
                            onClick={() => handleFileImport(index)}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                          >
                            Import new file
                          </li>
                          <li
                            onClick={() => handleDeleteFile(index)}
                            className="px-3 py-2 text-red-600 cursor-pointer hover:bg-gray-100"
                          >
                            Delete
                          </li>
                        </ul>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold text-[16px]">
              <td className="px-4 py-5 text-left">Total</td>
              <td className="py-5 text-center">
                {tableData.reduce(
                  (sum, row) => sum + (parseInt(row.kWh || "0", 10) || 0),
                  0
                )}
              </td>
              <td className="py-5 text-center">
                {tableData
                  .reduce(
                    (sum, row) => sum + (parseFloat(row.tonCO2eq || "0") || 0),
                    0
                  )
                  .toFixed(3)}
              </td>
              <td className="py-5 text-center">
                <button className="text-[14px] font-medium bg-[#40A261FF] text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Export File
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
