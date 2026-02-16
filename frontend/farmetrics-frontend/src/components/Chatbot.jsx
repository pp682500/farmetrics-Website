import { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const KNOWLEDGE_BASE = {
    "hello": "Namaste! I am Srishti, your Farmetrics assistant. How can I help you today?",
    "hi": "Namaste! I am Srishti. How can I assist you with your farming queries?",
    "who are you": "I am Srishti, an intelligent assistant designed by Priyam Pandey to help farmers calculate yields and find government resources.",
    "yield": "To calculate yield, go to the 'Start Calculator' section and enter your crop details. I can help you understand the results if you like!",
    "profit": "Profit is calculated by subtracting your total expenses (seeds, labor, fertilizer) from your total revenue. Our dashboard shows this clearly.",
    "bhulekh": "Bhulekh is the government portal for land records. You can access it through the 'Land Records' section on our home page.",
    "scheme": "There are many government schemes like PM-KISAN and Soil Health Card. Check the 'Resources' section for direct links!",
    "pm kisan": "PM-KISAN is a central scheme providing ₹6,000 per year to small and marginal farmers in three installments.",
    "weather": "Weather plays a huge role in yield. You should check the local forecast in our Resources section before planning your harvest.",
    "help": "I can help with: \n1. How to use the calculator\n2. Finding land records\n3. Information on government schemes\n4. Crop yield tips",
    "default": "That's an interesting question! While I'm still learning, I recommend checking our 'Resources' section for detailed guides, or you can ask about yields and schemes."
};

// API Key moved to secure backend

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Namaste! I am Srishti. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);


    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setInput("");
        setIsTyping(true);

        // --- SECURE BACKEND API CALL ---
        try {
            const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
            const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: messages,
                    userMsg: userMsg
                })
            });

            const data = await response.json();

            if (data.text) {
                setMessages(prev => [...prev, { text: data.text, isBot: true }]);
            } else {
                throw new Error(data.message || data.error || "Failed to get response from server");
            }
        } catch (err) {
            console.error("Chat Error:", err);
            setMessages(prev => [...prev, {
                text: `⚠️ Connection Failed. \n\nError: ${err.message}\n\nPlease make sure the chatbot backend is running!`,
                isBot: true
            }]);
        }
        setIsTyping(false);
        return;


        // --- OPTION 2: FALLBACK (Only if key is missing) ---
        setTimeout(() => {
            let response = "I am currently in 'Simple Mode' because I cannot detect my AI Brain (API Key). Please check your .env file and restart your terminal!";

            // Allow basic local greetings even without AI
            if (userMsg.toLowerCase().includes("hello") || userMsg.toLowerCase().includes("hi")) {
                response = "Namaste! I am Srishti. My AI features are currently offline, but you can still use the yield calculator on our main page!";
            }

            setMessages(prev => [...prev, { text: response, isBot: true }]);
            setIsTyping(false);
        }, 800);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-green-700 rounded-full shadow-2xl flex items-center justify-center overflow-hidden hover:bg-green-800 transition-all transform hover:scale-110 active:scale-95 border-4 border-white"
            >
                {isOpen ? "❌" : <img src="/natasha.png" alt="Srishti" className="w-full h-full object-cover" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                    </span>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-green-100 animate-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="bg-green-700 p-4 text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white overflow-hidden flex items-center justify-center">
                            <img src="/natasha.png" alt="Srishti" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h3 className="font-bold">Srishti</h3>
                            <div className="text-[10px] flex items-center gap-2">
                                <span className="text-green-200">Online</span>
                                <span className="bg-green-600 px-1.5 py-0.5 rounded text-white flex items-center gap-1">
                                    <span className="w-1 h-1 bg-white rounded-full"></span> AI Active
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.isBot
                                        ? "bg-white text-gray-800 rounded-tl-none border border-green-50"
                                        : "bg-green-700 text-white rounded-tr-none"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-green-50 flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Quick Suggestions */}
                    <div className="px-4 py-2 bg-gray-50 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
                        {["How to calculate yield?", "PM Kisan Scheme", "Land Records", "Help"].map((text) => (
                            <button
                                key={text}
                                onClick={() => setInput(text)}
                                className="text-xs bg-white border border-green-200 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-50 transition"
                            >
                                {text}
                            </button>
                        ))}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask Srishti anything..."
                            className="flex-1 border-none focus:ring-0 text-sm placeholder-gray-400"
                        />
                        <button
                            type="submit"
                            className="bg-green-700 text-white p-2 rounded-xl hover:bg-green-800 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Chatbot;
