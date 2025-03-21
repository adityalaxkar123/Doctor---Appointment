import { useState, useEffect, useRef, useContext } from "react";
import { FiSend, FiTrash2 } from "react-icons/fi";
import { FaUserMd } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { AppContext } from "../context/AppContext.jsx";

export default function Chatbot() {
  const [messages, setMessages] = useState(() => {
    return JSON.parse(localStorage.getItem("chatHistory")) || [];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { backendUrl } = useContext(AppContext);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = { role: "bot", content: "Welcome to AI Doctor! 🚑 \nTell me your symptoms, and I will suggest possible diagnoses." };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);
  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chatHistory");
  };
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);

    setTimeout(async () => {
      try {
        const { data } = await axios.post(`${backendUrl}/api/user/chatbot-response`, { message: input });

        if (data.success) {
          const botResponse = {
            role: "bot",
            content: `**Disease:** ${data.response.disease}\n\n**Precautions:**\n- ${data.response.precaution.join("\n- ")}\n\n**Cure:**\n- ${data.response.cure.join("\n- ")}\n\n**Recommended Doctor:** ${data.response.recommendedDoctor}`,
          };

          setMessages((prevMessages) => [...prevMessages, botResponse]);
        } else {
          setMessages((prevMessages) => [...prevMessages, { role: "bot", content: data.message }]);
        }
      } catch (error) {
        console.error("Error fetching diagnosis:", error);
        setMessages((prevMessages) => [...prevMessages, { role: "bot", content: "⚠️ Error retrieving diagnosis. Please try again later." }]);
      }

      setLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
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
          className="w-80 bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-xl rounded-2xl border p-4 flex flex-col"
        >
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <h2 className="text-lg font-semibold flex items-center">
              <FaUserMd className="mr-2" /> AI Doctor
            </h2>
            <div className="flex space-x-2">
              <button className="text-white" onClick={clearChat} title="Clear Chat">
                <FiTrash2 className="text-xl" />
              </button>
              <button className="text-white" onClick={() => setIsOpen(false)}>✕</button>
            </div>
          </div>
          <div className="h-64 overflow-y-auto p-2 space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`px-3 py-2 rounded-lg max-w-[80%] ${msg.role === "user" ? "bg-white text-blue-600" : "bg-gray-100 text-gray-800"}`}>
                  {msg.content.split("\n").map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            {loading && <div className="text-gray-300">Typing...</div>}
            <div ref={chatEndRef} /> {/* Auto-scroll Target */}
          </div>
          <div className="flex items-center border-t pt-2">
            <input
              className="flex-grow p-2 border rounded-l-lg focus:outline-none text-gray-900"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your symptoms..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
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
