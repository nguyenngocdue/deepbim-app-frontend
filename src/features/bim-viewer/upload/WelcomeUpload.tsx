import { useState, useEffect } from "react";
import { ModalHeader } from "./ModalHeader";
import { Button } from "@/components/ui/button";
import { Header } from "./Header";
import HelpForm from "./HelpForm";

const WelcomeUpload = () => {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [showHelpForm, setShowHelpForm] = useState(false);

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

    const handleFileDrop = (files: File[]) => {
        console.log("Files dropped:", files);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            handleFileDrop(Array.from(event.dataTransfer.files));
        }
    };

    return (
        <div className={`relative h-screen flex flex-col ${theme === "dark" ? "bg-gray-900" : "bg-gray-200"}`}>
            <Header onToggleTheme={toggleTheme} className={theme === "dark" ? "bg-gray-800" : "bg-gray-100"} />
            <div className={`relative flex flex-col items-center justify-center flex-1 p-6 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center backdrop-blur-lg">
                    <ModalHeader title="Welcome to DeepBIM" subtitle="Your Trusted 3D / BIM Viewer" />
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className="border-dashed border-4 border-purple-500 rounded-xl p-10 text-center cursor-pointer transition hover:border-purple-700"
                    >
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Drag & Drop your 3D model here</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Supported formats: .ifc, .glb, .xkt, .las, .laz, .obj, .stl, .bim, .zip</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Max 5 models, 0.5GB each</p>
                        <Button className="mt-4">View your 3D model</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <Button className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg transition hover:bg-gray-300 dark:hover:bg-gray-600">Try IFC (.ifc)</Button>
                        <Button className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg transition hover:bg-gray-300 dark:hover:bg-gray-600">Try BIM + PointCloud (.ifc + .xkt)</Button>
                        <Button className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg transition hover:bg-gray-300 dark:hover:bg-gray-600">Try LiDAR Scan (.laz)</Button>
                        <Button className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg transition hover:bg-gray-300 dark:hover:bg-gray-600">Try Textured (.glb)</Button>
                    </div>
                </div>
            </div>


            <button
                className="fixed bottom-6 left-6 rounded-full p-4 shadow-lg transition bg-purple-600 hover:bg-purple-800 text-white"
                onClick={() => setShowHelpForm(true)}
            >
                {!showHelpForm  ? "Need help" : ""}
            </button>

            {showHelpForm && <HelpForm onClose={() => setShowHelpForm(false)} />}

        </div>
    );
};

export default WelcomeUpload;
