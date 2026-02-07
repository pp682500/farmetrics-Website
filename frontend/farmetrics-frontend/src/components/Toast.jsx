import { useEffect } from "react";

function Toast({ message, type = "success", onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 transform transition-all duration-300 animate-in slide-in-from-top-5 fade-in ${type === "error"
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-green-50 text-green-800 border border-green-200"
            }`}>
            <span className="text-xl">
                {type === "error" ? "❌" : "✅"}
            </span>
            <p className="font-medium">{message}</p>
            <button
                onClick={onClose}
                className="ml-4 text-gray-400 hover:text-gray-600 font-bold"
            >
                ×
            </button>
        </div>
    );
}

export default Toast;
