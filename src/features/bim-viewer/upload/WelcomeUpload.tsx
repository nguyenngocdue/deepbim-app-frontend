import React, { useState, useEffect, useRef } from "react";
import { ModalHeader } from "./ModalHeader";
import { Button } from "@/components/ui/button";
import { Header } from "./Header";
import HelpForm from "./HelpForm";
import { useNavigate } from "@tanstack/react-router";

const WelcomeUpload = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showHelpForm, setShowHelpForm] = useState(false);
  const navigate = useNavigate({ from: "/" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme as "light" | "dark");
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Hàm tạo mã duy nhất từ tên file
  const generateFileCode = (fileName: string) => {
    const timestamp = Date.now();
    return `${fileName.replace(/\.[^/.]+$/, "")}-${timestamp}`; // Tên file + timestamp
  };

  // Xử lý khi có file (từ kéo thả hoặc chọn file)
  const handleFiles = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0]; // Lấy file đầu tiên
      const fileCode = generateFileCode(file.name); // Tạo mã duy nhất
      const status = "upload_by_user";

      // Lấy phần mở rộng của file
      const fileType = file.name.split(".").pop()?.toLowerCase();

      // Truyền thêm trạng thái
      navigate({
        to: `/viewer/${fileCode}`,
        state: {
          file, // File gốc
          uploadTime: new Date().toISOString(), // Thời gian upload
          fileType, // Loại file (ví dụ: "svg", "ifc", v.v.)
          isExample: false, // Cờ để chỉ định đây không phải file mẫu,
          status,
        },
      });
    }
  };

  // Xử lý kéo thả
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleFiles(Array.from(event.dataTransfer.files));
    }
  };

  // Xử lý khi click để chọn file
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      handleFiles(Array.from(event.target.files));
    }
  };

  // Mở file explorer khi click vào khu vực kéo thả
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleNavigate = (path: string, state?: any) => {
    navigate({
      to: path,
      state: state,
    });
  };

  return (
    <div
      className={`relative h-screen flex flex-col ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-200"
      }`}
    >
      <Header
        onToggleTheme={toggleTheme}
        className={theme === "dark" ? "bg-gray-800" : "bg-gray-100"}
      />
      <div
        className={`relative flex flex-col items-center justify-center flex-1 p-6 ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center backdrop-blur-lg">
          <ModalHeader
            title="Welcome to DeepBIM"
            subtitle="Your Trusted 3D / BIM Viewer"
          />
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={handleClick}
            className="relative border-dashed border-3 border-purple-400 dark:border-purple-500 rounded-xl p-8 text-center cursor-pointer transition-all duration-300 hover:border-purple-600 dark:hover:border-purple-400 hover:bg-purple-50/30 dark:hover:bg-purple-900/20 shadow-sm"
          >
            {/* Input file ẩn */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              className="hidden"
              accept=".ifc,.glb,.xkt,.las,.laz,.obj,.stl,.bim,.zip,.svg"
              multiple
            />
            <div className="flex flex-col items-center">
              {/* Icon upload */}
              <svg
                className="w-12 h-12 text-purple-500 dark:text-purple-400 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Drag & Drop your 3D model here
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Supported formats: .ifc, .glb, .xkt, .las, .laz, .obj, .stl,
                .bim, .zip, .svg
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Max 5 models, 0.5GB each
              </p>
              <Button
                className="mt-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-4 py-2 transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                View your 3D model
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg transition hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() =>
                handleNavigate("/example-model/ifc", { status: "example"})
              }
            >
              Try IFC (.ifc)
            </Button>
            <Button className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg transition hover:bg-gray-300 dark:hover:bg-gray-600">
              Try BIM + PointCloud (.ifc + .xkt)
            </Button>
            <Button className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg transition hover:bg-gray-300 dark:hover:bg-gray-600">
              Try LiDAR Scan (.laz)
            </Button>
            <Button className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg transition hover:bg-gray-300 dark:hover:bg-gray-600">
              Try Textured (.glb)
            </Button>
          </div>
        </div>
      </div>

      <Button
        className="fixed bottom-6 left-6 rounded-full p-4 shadow-lg transition bg-logo-50 hover:bg-purple-800 text-white"
        onClick={() => setShowHelpForm(true)}
      >
        {!showHelpForm ? <span>Need help</span> : ""}
      </Button>

      {showHelpForm && 
        <HelpForm onClose={() => setShowHelpForm(false)} />
      }
    </div>
  );
};

export default WelcomeUpload;