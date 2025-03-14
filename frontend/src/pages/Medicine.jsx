import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from 'axios'
const Medicine = () => {
  const { medicineId } = useParams();
  const { medicines, token ,backendUrl} = useContext(AppContext); 
  const navigate = useNavigate();
  const [phone,setPhone] = useState(0)
  const [address,setAddress] = useState('')
  const [mg,setMg] = useState(0)
  const [ml,setMl] = useState(0)
  const [medData, setMedData] = useState(null);


  useEffect(() => {
    if (!token) {
      toast.warn("login to book medicine")
      navigate("/login"); 
    }
  }, [token, navigate]);

  useEffect(() => {
    const selectedMedicine = medicines.find((med) => med._id === medicineId);
    setMedData(selectedMedicine); 
  }, [medicineId, medicines]);

  if (!medData) {
    return <p className="text-center text-lg text-red-500">Medicine not found or still loading...</p>;
  }
  // console.log(medData)
  const getCurrentDateTime=()=> {
    const now = new Date();
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    return now.toLocaleString("en-US", options);
  }
const onSubmitHandler = async(e)=>{
  e.preventDefault()
  try {
    const orderData = {
      mg,
      ml,
      address,
      phone,
      medData,
      orderDate:getCurrentDateTime()
    }
    const {data} = await axios.post(backendUrl+'/api/user/order',orderData,{headers:{token}})
    if(data.success){
      toast.success(data.message)
      setMg(0)
      setMl(0)
      setPhone(0)
      setAddress('')
      navigate('/my-orders')
    }else{
      toast.error(data.message)
    }
  } catch (error) {
    console.log(error)
    toast.error(error.message)
  }
}
  return medData && (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Image Section */}
      <div className="mb-6 flex justify-center">
        <img 
          src={medData.image || "https://via.placeholder.com/400"}  // Use a placeholder if no image is available
          alt={medData.name}
          className="w-80 h-auto rounded-lg shadow-md"  // Set width and auto height
        />
      </div>

      {/* Medicine Info */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">{medData.name}</h2>
        <p className="text-gray-600 mt-2">{medData.description}</p>
        <p className="text-lg font-medium mt-4"><strong>Type:</strong> {medData.type}</p>
        <p className="text-lg font-medium mt-2"><strong>Price:</strong> ₹{medData.price}</p>
      </div>

      {/* Order Form */}
      <form onSubmit={onSubmitHandler} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <label htmlFor="quantity" className="text-lg font-medium sm:w-1/3">
          Quantity{medData.category === "dressing" ? "" : ` (${medData.category === "tablet" ? "mg" : "ml"})`}:
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={medData.category === "tablet" ? mg:ml}
            onChange={(e)=> medData.category === "tablet" ? setMg(e.target.value):setMl(e.target.value) }
            placeholder={`Enter quantity${medData.category === "dressing" ? "" : ` in ${medData.category === "tablet" ? "mg" : "ml"}`}`}
            className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Address */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <label htmlFor="address" className="text-lg font-medium sm:w-1/3">
            Delivery Address:
          </label>
          <textarea
            id="address"
            name="address"
            value={address}
            onChange={(e)=> setAddress(e.target.value)}
            placeholder="Enter delivery address"
            className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <label htmlFor="phone" className="text-lg font-medium sm:w-1/3">
            Phone Number:
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={phone}
            onChange={(e)=> setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default Medicine;
