"use client";
import { useState } from "react";
import axios from "axios";

interface DataItem {
  vehicle_license_plate: string;
  month: string;
  fuel_type: string;
  volume_liter: string;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null); // State to store the selected file
  const [data, setData] = useState<DataItem[] | null>(null); // State to store the data received from the server

  // Function to handle file selection from the input field
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]); // Set the selected file to state
    }
  };

  // Function to handle file upload
  const handleUpload = async () => {
    if (!file) return; // Exit if no file is selected

    const formData = new FormData();
    formData.append("file", file); // Append the file to FormData to send to the server

    try {
      // Make an API request to upload the file
      const response = await axios.post(
        "http://localhost:8000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set header to indicate multipart form data
          },
        }
      );
      setData(response.data.data); // Set the response data to state to display it later
    } catch (error) {
      console.error("Error uploading file:", error); // Log any errors that occur during the upload
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Fuel Receipt PDF</h1>
      {/* Input to select file */}
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4"
        title="เลือกไฟล์"
      />
      {/* Button to trigger file upload */}
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Upload
      </button>
      {/* Display the extracted data in a table if available */}
      {data && (
        <table className="table-auto w-full mt-4">
          <thead>
            <tr>
              <th>ทะเบียนรถ</th>
              <th>เดือน</th>
              <th>ชนิดเชื้อเพลิง</th>
              <th>ปริมาณ (ลิตร)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item["vehicle_license_plate"]}</td>
                <td>{item["month"]}</td>
                <td>{item["fuel_type"]}</td>
                <td>{item["volume_liter"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
