import { useState, useEffect } from "react";
// import axios from "axios";
import { FiSend } from "react-icons/fi";
import { FaUserMd } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: "bot", content: "Let's diagnose the disease. Please elaborate  your symptoms." }]);
    }
  }, [isOpen]);
  
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const newMessage = { role: "user", content: input };
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);
    
    // try {
    //   const res = await axios.post("/api/chat", { userMessage: input });
    //   setMessages([...messages, newMessage, { role: "bot", content: res.data.reply }]);
    // } catch (error) {
    //   console.error("Error:", error);
    // }
    
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4">
      {!isOpen && (
        <button 
          className="p-4 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center"
          onClick={() => setIsOpen(true)}
        >
          <FaUserMd size={24} />
        </button>
      )}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="w-80 bg-white shadow-xl rounded-2xl border p-4 flex flex-col"
        >
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <h2 className="text-lg font-semibold flex items-center">
              <FaUserMd className="mr-2" /> AI Doctor
            </h2>
            <button className="text-gray-500" onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="h-64 overflow-y-auto p-2 space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <span className={`px-3 py-2 rounded-lg ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                  {msg.content}
                </span>
              </div>
            ))}
            {loading && <div className="text-gray-400">Typing...</div>}
          </div>
          <div className="flex items-center border-t pt-2">
            <input
              className="flex-grow p-2 border rounded-l-lg focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about symptoms..."
            />
            <button className="p-2 bg-blue-500 text-white rounded-r-lg" onClick={sendMessage}>
              <FiSend />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
