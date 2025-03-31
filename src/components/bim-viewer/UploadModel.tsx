import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RiUpload2Fill } from "react-icons/ri";

interface UploadModelProps {
    onToggle: (filePath: Uint8Array | null) => void; // Callback function to handle the selected file path
    isActive: boolean; // Current state of the Section Box
}

const UploadModel: React.FC<UploadModelProps> = ({ onToggle, isActive }) => {
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const [isLoading, setIsLoading] = useState(false); // State để hiển thị spinner

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Trigger the file input dialog
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file) return;
            setIsLoading(true); // Bật loading

            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const buffer = new Uint8Array(reader.result as ArrayBuffer);
                    onToggle(buffer); // Truyền buffer lên component cha
                } catch (error) {
                    console.error("Error reading file:", error);
                    onToggle(null); // Xử lý lỗi
                } finally {
                    setIsLoading(false); // Tắt loading dù thành công hay thất bại
                } reader.onerror = () => {
                    console.error("FileReader error");
                    setIsLoading(false); // Tắt loading nếu có lỗi
                    onToggle(null);
                };
                reader.onerror = () => {
                    console.error("FileReader error");
                    setIsLoading(false); // Tắt loading nếu có lỗi
                };
            };
            reader.readAsArrayBuffer(file);
            // console.log("Selected file:", file);

        } else {
            console.log("No file selected");
            onToggle(null); // Handle case where no file is selected
        }
    };
    return (
        <>
            <Button
                title="Upload IFC Model"
                onClick={handleButtonClick}
                className={`hover:bg-blue-500 ${isActive ? 'bg-green-500' : ''}`}
            >
                <RiUpload2Fill className="text-lg" />
                <span className="ml-1">{
                        isLoading ? "Loading" : "Upload IFC"
                }</span>
            </Button>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".ifc" // Only allow IFC files
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
        </>
    );
};

export default UploadModel;