import { useState, useContext } from "react";
import axios from "axios";
import { DoctorContext } from "../../context/DoctorContext.jsx";
import { toast } from "react-toastify";

const AiPrescription = () => {
  const { backendUrl, dToken } = useContext(DoctorContext);

  const [details, setDetails] = useState({
    medication: "",
    dosage: "",
    quantity: "",
    refills: "",
  });

  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [generatedPrescription, setGeneratedPrescription] = useState("");

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const getUserId = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/userId`, { email });
      if (data.success) {
        setUserId(data.userId);
        toast.success("User found successfully!");
      } else {
        setUserId(null);
        toast.error("User not found");
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
      toast.error("Error fetching user ID");
      setUserId(null);
    }
  };

  const generatePrescription = async () => {
    if (!userId) return toast.error("User ID is required!");
    if (!dToken) return toast.error("Authorization token missing!");

    const requestData = {
      userId,
      prescriptionDetails: details,
    };
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/generate-prescription",
        requestData,
        { headers: { dToken } }
      );
      if (data.success) {
        setGeneratedPrescription(data.imageUrl);
        toast.success(data.message);
      }
    } catch (error) {
      console.error("Error generating prescription:", error);
      toast.error("Failed to generate prescription");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-lg border border-gray-200">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">AI Prescription Generator</h2>
        {!userId ? (
          <>
            <input
              type="text"
              placeholder="Enter User Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <button
              onClick={getUserId}
              className="w-full bg-green-600 text-white py-3 mt-4 rounded-lg hover:bg-green-700 transition-all duration-300 font-semibold"
            >
              Get User ID
            </button>
          </>
        ) : (
          <>
            <div className="space-y-4">
              {Object.keys(details).map((key) => (
                <input
                  key={key}
                  type="text"
                  name={key}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  required
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              ))}
            </div>
            <button
              onClick={generatePrescription}
              className="w-full bg-blue-600 text-white py-3 mt-4 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold"
            >
              Generate Prescription
            </button>
            {generatedPrescription && (
              <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Generated Prescription:</h3>
                <a
                  href={generatedPrescription}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Prescription
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AiPrescription;
