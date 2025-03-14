import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Store = () => {
  const { category } = useParams();
  const { medicines } = useContext(AppContext);
  const navigate = useNavigate();
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    let result = medicines;

    if (category) {
      result = result.filter((med) => med.category === category);
    }

    if (searchTerm) {
      result = result.filter((med) => med.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    setFilteredMedicines(result);
  }, [medicines, category, searchTerm]);

  return (
    <div>
      <p className="text-gray-600">Browse and buy medicines from our store</p>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search medicine..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        className="w-full px-4 py-2 border border-gray-300 rounded mt-3"
      />

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        {/* Filter Button for Mobile */}
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden 
          ${showFilter ? "bg-primary text-white" : ""}`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>

        {/* Category Filters */}
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? "flex" : "hidden sm:flex"}`}>
          {["tablet", "syrup", "ointment", "capsule", "injection","dressing"].map((cat) => (
            <p
              key={cat}
              onClick={() => navigate(category === cat ? "/store" : `/store/${cat}`)}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded cursor-pointer transition-all
              ${category === cat ? "bg-indigo-100 text-black" : ""}`}
            >
              {cat}
            </p>
          ))}
        </div>

        {/* Medicines List */}
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {filteredMedicines.length > 0 ? (
            filteredMedicines.map((med) => (
              <div
                onClick={() => navigate(`/medicine/${med._id}`)}
                className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
                key={med._id}
              >
                <img className="bg-blue-50 w-full h-40 object-cover" src={med.image} alt={med.name} />
                <div className="p-4">
                  <div className={`flex items-center gap-2 text-sm ${med.available ? "text-green-500" : "text-gray-500"}`}>
                    <p className={`w-2 h-2 ${med.available ? "bg-green-500" : "bg-gray-500"} rounded-full`}></p>
                    <p>{med.available ? "Available" : "Out of Stock"}</p>
                  </div>
                  <p className="text-gray-900 text-lg font-medium">{med.name}</p>
                  <p className="text-gray-600 text-sm">{med.category}</p>
                  <p className="text-blue-500 font-semibold">₹{med.price}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No medicines found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Store;
