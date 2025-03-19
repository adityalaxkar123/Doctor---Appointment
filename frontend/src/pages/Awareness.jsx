import { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assets, diseases } from "../assets/assets.js"; // Import disease data
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";
const Awareness = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [category, setCategory] = useState("All");
  const { backendUrl } = useContext(AppContext);
  const [latestDisease, setLatestDisease] = useState(false);
  const categories = ["All", "Viral", "Chronic", "Common"];
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const filteredDiseases = diseases.filter(
    (disease) =>
      (category === "All" || disease.category === category) &&
      disease.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchDiseaseData = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/gemini-response"
      );
      if (data.success) {
        setLatestDisease(data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchDiseaseData();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br bg-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Disease Awareness
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Learn about diseases, their symptoms, and prevention methods.
        </p>
        <div className="relative bg-white border border-gray-200 shadow-md rounded-xl p-8 mb-8 max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Most Virulent Disease in India
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between text-gray-700">
            <div className="text-center md:text-left md:w-1/2">
              {latestDisease ? (
                <>
                  <p className="text-2xl font-semibold text-red-600">
                    {latestDisease.disease}
                  </p>
                  <p className="text-lg mt-2">
                    <span className="font-bold">{latestDisease.infected}</span>{" "}
                    Infected People
                  </p>
                  <p className="text-lg">
                    <span className="font-bold">{latestDisease.deaths}</span>{" "}
                    Deaths
                  </p>
                </>
              ) : (
                <div className="w-48 h-6 bg-gray-300 animate-pulse rounded-md mx-auto"></div>
              )}
            </div>
            <div className="hidden md:flex items-center justify-center md:w-1/2">
              <img
                src={assets.virus_icon}
                alt="Virus Icon"
                className="w-20 h-20 opacity-90"
              />
            </div>
          </div>
          <div className="mt-6">
            <p className="text-gray-600 text-sm mb-2">Death Ratio Progress</p>

            <div className="w-full bg-gray-200 rounded-full h-4 md:h-5 shadow-inner overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all duration-1000 ease-in-out"
                style={{
                  width: `${
                    latestDisease && latestDisease.infected > 0
                      ? (latestDisease.deaths / latestDisease.infected) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
            <p className="text-gray-700 text-sm mt-1">
              <span className="font-semibold">
                {latestDisease && latestDisease.infected > 0
                  ? (
                      (latestDisease.deaths / latestDisease.infected) *
                      100
                    ).toFixed(2)
                  : "0.00"}
                %
              </span>
            </p>
          </div>
          <p className="mt-4 text-sm text-gray-500 italic">
            Stay informed and follow health guidelines to protect yourself.
          </p>
          <div className="mt-6 text-center">
            <button
              className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onClick={() => setIsPopupOpen(true)}
            >
              🔗 Read More
            </button>
            {isPopupOpen && latestDisease && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 z-40  flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                >
                  <button
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl"
                    onClick={() => setIsPopupOpen(false)}
                  >
                    &times;
                  </button>
                  <h2 className="text-3xl font-semibold text-red-600">
                    {latestDisease.disease}
                  </h2>
                  <h3 className="mt-6 text-lg font-semibold text-gray-800">
                    🛡️ Precautions:
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 bg-gray-100 p-4 rounded-lg shadow-md">
                    {latestDisease.precautions.map((pre, idx) => (
                      <li
                        key={idx}
                        className="mb-1 pl-2 text-gray-800 leading-relaxed"
                      >
                        {pre}
                      </li>
                    ))}
                  </ul>
                  <h3 className="mt-6 text-lg font-semibold text-gray-800">
                    💊 Cure:
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 bg-gray-100 p-4 rounded-lg shadow-md">
                    {latestDisease.cure.map((cure, idx) => (
                      <li
                        key={idx}
                        className="mb-1 pl-2 text-gray-800 leading-relaxed"
                      >
                        {cure}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://www.who.int/india/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-semibold hover:text-blue-800 transition duration-300 underline hover:no-underline"
                  >
                    🌐 WHO Site
                  </a>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
        <div className="relative w-full md:w-2/3 lg:w-1/2 mx-auto">
          <input
            type="text"
            placeholder="Search for a disease..."
            className="w-full px-4 py-3 pl-12 pr-12 rounded-full border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-lg transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
            🔍
          </span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="flex justify-center mt-6">
          <div className="relative block md:hidden">
            <select
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-md"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="hidden md:flex space-x-4">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-lg transition ${
                  category === cat
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-200 text-gray-700"
                } hover:bg-indigo-400 hover:text-white`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {filteredDiseases.length > 0 ? (
          filteredDiseases.map((disease, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedDisease(disease)}
            >
              <img
                src={disease.image}
                alt={disease.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-5">
                <h2 className="text-2xl font-semibold text-indigo-600">
                  {disease.name}
                </h2>
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {disease.description}
                </p>
                <button className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition">
                  View More
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No disease found
          </p>
        )}
      </motion.div>
      <AnimatePresence>
        {selectedDisease && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl"
                onClick={() => setSelectedDisease(null)}
              >
                &times;
              </button>
              <img
                src={selectedDisease.image}
                alt={selectedDisease.name}
                className="w-full h-40 object-cover rounded-lg"
              />
              <h2 className="text-3xl font-semibold text-indigo-600 mt-4">
                {selectedDisease.name}
              </h2>
              <p className="text-gray-700 mt-2">
                {selectedDisease.description}
              </p>
              <h3 className="font-medium mt-4 text-gray-900">Precautions:</h3>
              <ul className="list-disc list-inside text-gray-700">
                {selectedDisease.precautions.map((precaution, idx) => (
                  <li key={idx}>{precaution}</li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-12 bg-indigo-500 text-white p-6 rounded-lg text-center">
        <h2 className="text-3xl font-semibold">Did You Know?</h2>
        <p className="mt-2 text-lg">
          Over <span className="font-bold">422 million</span> people worldwide
          suffer from diabetes, and
          <span className="font-bold"> 1.28 billion</span> adults have
          hypertension.
        </p>
      </div>
    </div>
  );
};

export default Awareness;
