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

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Namaste! I am Srishti. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    // --- DEBUG: LOG KEY TO CONSOLE ---
    useEffect(() => {
        if (isOpen) {
            console.log("Chatbot Opened. API Key Status:", GEMINI_API_KEY ? "Found" : "Missing");
        }
    }, [isOpen]);

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

        // --- OPTION 1: GEMINI AI (Primary Brain) ---
        if (GEMINI_API_KEY && GEMINI_API_KEY.length > 20) {
            // Priority list based on user's authorized models
            const modelsToTry = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash-lite"];
            let lastError = "";

            const systemPrompt = "You are Srishti, an intelligent Indian farming assistant for 'Farmetrics'. Created by Priyam Pandey. You are an expert in crop yields, Indian government schemes, and land records. Tone: encouraging, expert, professional. Always use 'Namaste'.";

            const chatHistory = messages
                .slice(1)
                .map(m => `${m.isBot ? "Assistant" : "User"}: ${m.text}`)
                .join("\n");

            const fullPrompt = `${systemPrompt}\n\nRecent Conversation:\n${chatHistory}\n\nUser Question: ${userMsg}\n\nDetailed Expert Answer:`;

            for (const modelName of modelsToTry) {
                try {
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;

                    const response = await fetch(url, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: fullPrompt }] }]
                        })
                    });

                    const data = await response.json();

                    if (data.error) {
                        lastError = data.error.message;
                        continue; // Try next model
                    }

                    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                        const text = data.candidates[0].content.parts[0].text;
                        setMessages(prev => [...prev, { text, isBot: true }]);
                        setIsTyping(false);
                        return; // ✅ Success!
                    }
                } catch (err) {
                    lastError = err.message;
                }
            }

            // --- FINAL ATTEMPT: List Models to debug ---
            try {
                const listUrl = `https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`;
                const listRes = await fetch(listUrl);
                const listData = await listRes.json();

                if (listData.models) {
                    const availableModels = listData.models.map(m => m.name.split('/').pop()).join(", ");
                    setMessages(prev => [...prev, {
                        text: `⚠️ My models (Flash/Pro) are not responding. \n\nYour account supports: ${availableModels}. \n\nPlease tell Natasha's creator, Priyam, which one to activate!`,
                        isBot: true
                    }]);
                } else {
                    throw new Error("Could not list models.");
                }
            } catch (err) {
                setMessages(prev => [...prev, {
                    text: `⚠️ Connection Failed. \n\nError: ${lastError}\n\nTip: You might need to refresh your API key in AI Studio.`,
                    isBot: true
                }]);
            }
            setIsTyping(false);
            return;
        }

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
                                {GEMINI_API_KEY && GEMINI_API_KEY.length > 20 ? (
                                    <span className="bg-green-600 px-1.5 py-0.5 rounded text-white flex items-center gap-1">
                                        <span className="w-1 h-1 bg-white rounded-full"></span> AI Active
                                    </span>
                                ) : (
                                    <span className="bg-orange-500 px-1.5 py-0.5 rounded text-white">Offline Mode</span>
                                )}
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
