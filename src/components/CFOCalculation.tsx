"use client";

import { TableRow } from "@/types/CFOCalculation.types";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import React, { useState, useRef } from "react";
import { FaCheck, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalConfirmDelete from "@/components/modals/ConfirmDeleteModal";
import { formatNumber } from "@/helper/numberFormatter";
import axios from "axios";

const ALLOWED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
];
const MAX_FILE_SIZE_MB = 10 * 1024 * 1024; // 10MB
const MIN_DIMENSIONS = 512;
const MAX_DIMENSIONS = 10000;

const CFOCalculation: React.FC = () => {
  // State Management
  const [selectedYear, setSelectedYear] = useState(2024);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState<number | null>(null);

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

  const years = [2024, 2023, 2022, 2021];

  // Table Data State
  const [tableData, setTableData] = useState<TableRow[]>(
    months.map((month) => ({
      month,
      kWh: null,
      tonCO2eq: null,
      isLoading: false,
    }))
  );

  // Dropdown Handlers
  const handleYearClick = (year: number) => {
    setSelectedYear(year);
    setIsDropdownOpen(false);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
      setIsDropdownOpen(false);
    }
  };

  // File Validation
  const validateFile = async (file: File): Promise<string | null> => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "Invalid file type. Only .png, .jpeg, .jpg, and .pdf are supported.";
    }

    if (file.size > MAX_FILE_SIZE_MB) {
      return "File size must be under 10MB.";
    }

    if (file.type.startsWith("image/")) {
      const dimensions = await getImageDimensions(file);
      if (!dimensions) return "Unable to determine image dimensions.";

      const { width, height } = dimensions;
      if (width < MIN_DIMENSIONS || height < MIN_DIMENSIONS) {
        return "File size must not be smaller than 512 x 512 pixels.";
      }
      if (width > MAX_DIMENSIONS || height > MAX_DIMENSIONS) {
        return "File size must not be larger than 10,000 x 10,000 pixels.";
      }
    }

    return null;
  };

  const getImageDimensions = (
    file: File
  ): Promise<{ width: number; height: number } | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        resolve(null);
        URL.revokeObjectURL(url);
      };

      img.src = url;
    });
  };

  // OCR File Handling and API Integration
  const handleFileImport = async (index: number, file: File) => {
    const newData = [...tableData];
    newData[index].isLoading = true;
    setTableData(newData);

    try {
      const validationError = await validateFile(file);
      if (validationError) {
        throw new Error(validationError);
      }

      const base64String = await convertFileToBase64(file);

      // Call local API Route
      const response = await axios.post("/api/general_invoice_ocr", {
        imageBase64: base64String,
      });

      console.log("API Response:", response.data);

      // Simulate processing extracted data
      const extractedKWh = parseFloat(response.data.kWh || "6562"); // Adjust this key based on actual response
      const tonCO2eq =
        Math.floor(((extractedKWh * 0.4999) / 1000) * 1000) / 1000;

      newData[index].kWh = formatNumber(extractedKWh, 0);
      newData[index].tonCO2eq = formatNumber(tonCO2eq, 3);
      newData[index].isLoading = false;
      setTableData([...newData]);
      toast.success("File processed successfully!");
    } catch (error: unknown) {
      newData[index].isLoading = false;
      setTableData([...newData]);

      if (error instanceof Error) {
        toast.error(error.message || "An error occurred.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  // Convert File to Base64 String and Remove Content Type Prefix
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(",").pop(); // Removes the "data:image/...;base64," prefix
        resolve(base64String || "");
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteFile = (index: number) => {
    setTableData((prevData) =>
      prevData.map((row, i) =>
        i === index
          ? { ...row, kWh: null, tonCO2eq: null, isLoading: false }
          : row
      )
    );
    setModalIndex(null);
    toast.success("File deleted successfully!");
  };

  const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center">
      <div className="animate-spin-slow border-dashed rounded-full h-5 w-5 border border-green-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold font-archivo text-center mb-8">
        CFO SCOPE 2 Calculation
      </h1>

      {/* Year Selector */}
      <div className="mb-6 flex justify-center">
        <div className="w-[290px]">
          <label className="font-inter block text-sm font-bold mb-2">
            Select year
          </label>
          <div
            ref={dropdownRef}
            className="relative"
            tabIndex={0}
            onBlur={handleBlur}
          >
            <div
              className="cursor-pointer w-full px-4 py-2 border rounded-md text-sm flex justify-between items-center bg-white focus:outline-none focus:ring-1 focus:ring-[#559C2DFF]"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
                        ? "bg-[#F6FFF1] text-[#559C2DFF] font-bold"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {year}
                    {selectedYear === year && <FaCheck color="#559C2DFF" />}
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
                  {row.isLoading ? <LoadingSpinner /> : row.kWh || "-"}
                </td>
                <td className="py-5 text-center">
                  {row.isLoading ? <LoadingSpinner /> : row.tonCO2eq || "-"}
                </td>
                <td className="py-5 text-center relative">
                  {!row.kWh && !row.isLoading ? (
                    <label className="bg-[#559C2DFF] text-white px-4 py-2 rounded-md hover:bg-[#37631DFF] cursor-pointer">
                      Import File
                      <input
                        type="file"
                        accept=".png,.jpeg,.jpg,.pdf"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files &&
                          handleFileImport(index, e.target.files[0])
                        }
                      />
                    </label>
                  ) : row.isLoading ? (
                    <span className="text-gray-500">Calculating...</span>
                  ) : (
                    <Dropdown placement="right-start">
                      <DropdownTrigger>
                        <button className="text-green-600 focus:outline-none">
                          Edit
                        </button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Edit Options"
                        onAction={(actionKey) => {
                          if (actionKey === "import") {
                            document
                              .getElementById(`file-upload-${index}`)
                              ?.click();
                          } else if (actionKey === "delete") {
                            setModalIndex(index);
                          }
                        }}
                      >
                        <DropdownItem
                          key="import"
                          className="hover:bg-gray-100"
                        >
                          Import new file
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          className="text-red-600 hover:bg-gray-100"
                          color="danger"
                        >
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  )}
                  <input
                    title="Import new file"
                    type="file"
                    id={`file-upload-${index}`}
                    accept=".png,.jpeg,.jpg,.pdf"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files &&
                      handleFileImport(index, e.target.files[0])
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold text-[16px]">
              <td className="px-4 py-5 text-left">Total</td>
              <td className="py-5 text-center">
                {formatNumber(
                  tableData.reduce(
                    (sum, row) =>
                      sum + parseFloat(row.kWh?.replace(/,/g, "") || "0"),
                    0
                  ),
                  3
                )}
              </td>
              <td className="py-5 text-center">
                {formatNumber(
                  tableData.reduce(
                    (sum, row) => sum + parseFloat(row.tonCO2eq || "0"),
                    0
                  ),
                  3
                )}
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

      {/* Modal Confirm Delete */}
      {modalIndex !== null && (
        <ModalConfirmDelete
          isOpen={modalIndex !== null}
          onClose={() => setModalIndex(null)}
          onConfirm={() => handleDeleteFile(modalIndex)}
        />
      )}
    </div>
  );
};

export default CFOCalculation;
