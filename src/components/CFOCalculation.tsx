"use client";

import React, { useState, useRef } from "react";
import { FaCheck, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast"; // Import toast and Toaster

type TableRow = {
  month: string;
  kWh: string | null;
  tonCO2eq: string | null;
  isLoading: boolean;
};

export default function CFOCalculation() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editDropdown, setEditDropdown] = useState<number | null>(null);
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

  const [tableData, setTableData] = useState<TableRow[]>(
    months.map((month) => ({
      month,
      kWh: null,
      tonCO2eq: null,
      isLoading: false,
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
    const newData = [...tableData];
    newData[index].isLoading = true; // Set loading state
    setTableData(newData);

    setTimeout(() => {
      newData[index].kWh = "6,562"; // Mocked kWh value
      newData[index].tonCO2eq = "3.281"; // Mocked tonCO2eq value
      newData[index].isLoading = false; // Reset loading state
      setTableData([...newData]);

      // Trigger success toast with custom layout
      toast.success(
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full mr-3">
            <FaCheck className="text-[#40A261]" size={20} />
          </div>
          <span className="text-sm font-medium">Calculation Successful</span>
        </div>,
        {
          duration: 3000,
          style: {
            background: "#40A261",
            color: "#fff",
            borderRadius: "8px",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
          },
          icon: null, // Remove the default icon
        }
      );
    }, 2000); // Simulate a 2-second file processing delay
  };

  const handleDeleteFile = (index: number) => {
    const newData = [...tableData];
    newData[index].kWh = null;
    newData[index].tonCO2eq = null;
    newData[index].isLoading = false;
    setTableData(newData);
    setEditDropdown(null);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      {/* Toaster Component */}
      <Toaster position="top-right" reverseOrder={false} />

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
              className="cursor-pointer w-full px-4 py-2 border rounded-md text-sm flex justify-between items-center bg-white focus:outline-none focus:ring-1 focus:ring-[#559C2DFF]"
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
                    className={`px-4 py-2 cursor-pointer ${
                      selectedYear === year
                        ? "bg-[#F6FFF1] text-[#559C2DFF] font-bold"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {year}
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
                {/* kWh column */}
                <td className="py-5 text-center">
                  {row.isLoading ? (
                    <div className="flex justify-center items-center">
                      <div className="animate-spin-slow border-dashed rounded-full h-5 w-5 border border-green-600"></div>
                    </div>
                  ) : (
                    row.kWh || <span className="text-gray-500">-</span>
                  )}
                </td>
                {/* tonCO2eq column */}
                <td className="py-5 text-center">
                  {row.isLoading ? (
                    <div className="flex justify-center items-center">
                      <div className="animate-spin-slow border-dashed rounded-full h-5 w-5 border border-green-600"></div>
                    </div>
                  ) : (
                    row.tonCO2eq || <span className="text-gray-500">-</span>
                  )}
                </td>
                <td className="py-5 text-center relative">
                  {!row.kWh && !row.isLoading ? (
                    <button
                      onClick={() => handleFileImport(index)}
                      className="bg-[#559C2DFF] text-white px-4 py-2 rounded-md hover:bg-[#37631DFF]"
                    >
                      Import File
                    </button>
                  ) : row.isLoading ? (
                    <span className="text-gray-500">Calculating...</span>
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
        </table>
      </div>
    </div>
  );
}
