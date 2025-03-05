import React from "react";

const LoadingSpinner: React.FC = () => {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
            <div className="w-12 h-12 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
            <p className="text-blue-600 mt-4 font-semibold">Loading IFC Model...</p>
        </div>
    );
};

export default LoadingSpinner;
