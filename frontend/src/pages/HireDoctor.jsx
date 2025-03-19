import { useState } from 'react';
import { FaUserMd, FaEnvelope, FaBriefcase, FaIdBadge, FaClock, FaCamera } from 'react-icons/fa';

const HireDoctor = () => {
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    experience: '',
    degree: '',
    email: '',
    licenseNumber: '',
    phone: '',
    address: '',
    about: '',
    photo: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Doctor Data Submitted:', formData);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg text-gray-900 mt-10 border border-gray-200">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Hire as a Doctor</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-3">
            <FaUserMd className="mr-3 text-gray-600" />
            <input 
              type="text" 
              name="name" 
              placeholder="Doctor's Name" 
              value={formData.name} 
              onChange={handleChange} 
              className="w-full bg-transparent focus:outline-none" 
              required
            />
          </div>
          <div className="flex items-center bg-gray-100 rounded-lg p-3">
            <FaBriefcase className="mr-3 text-gray-600" />
            <input 
              type="text" 
              name="specialization" 
              placeholder="Specialization" 
              value={formData.specialization} 
              onChange={handleChange} 
              className="w-full bg-transparent focus:outline-none" 
              required
            />
          </div>
          <div className="flex items-center bg-gray-100 rounded-lg p-3">
            <FaClock className="mr-3 text-gray-600" />
            <input 
              type="number" 
              name="experience" 
              placeholder="Years of Experience" 
              value={formData.experience} 
              onChange={handleChange} 
              className="w-full bg-transparent focus:outline-none" 
              required
            />
          </div>
          <div className="flex items-center bg-gray-100 rounded-lg p-3">
            <FaIdBadge className="mr-3 text-gray-600" />
            <input 
              type="text" 
              name="degree" 
              placeholder="Degree" 
              value={formData.degree} 
              onChange={handleChange} 
              className="w-full bg-transparent focus:outline-none" 
              required
            />
          </div>
          <div className="flex items-center bg-gray-100 rounded-lg p-3">
            <FaEnvelope className="mr-3 text-gray-600" />
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full bg-transparent focus:outline-none" 
              required
            />
          </div>
          <div className="flex items-center bg-gray-100 rounded-lg p-3">
            <FaIdBadge className="mr-3 text-gray-600" />
            <input 
              type="text" 
              name="licenseNumber" 
              placeholder="Medical License Number" 
              value={formData.licenseNumber} 
              onChange={handleChange} 
              className="w-full bg-transparent focus:outline-none" 
              required
            />
          </div>
          <div className="flex items-center bg-gray-100 rounded-lg p-3">
            <FaUserMd className="mr-3 text-gray-600" />
            <input 
              type="text" 
              name="phone" 
              placeholder="Phone Number" 
              value={formData.phone} 
              onChange={handleChange} 
              className="w-full bg-transparent focus:outline-none" 
              required
            />
          </div>
          <div className="flex items-center bg-gray-100 rounded-lg p-3">
            <FaUserMd className="mr-3 text-gray-600" />
            <input 
              type="text" 
              name="address" 
              placeholder="Address" 
              value={formData.address} 
              onChange={handleChange} 
              className="w-full bg-transparent focus:outline-none" 
              required
            />
          </div>
        </div>
        <div className="bg-gray-100 rounded-lg p-3">
          <textarea
            name="about"
            placeholder="About"
            value={formData.about}
            onChange={handleChange}
            className="w-full bg-transparent focus:outline-none h-24"
            required
          ></textarea>
        </div>
        <div className="flex items-center bg-gray-100 rounded-lg p-3">
          <FaCamera className="mr-3 text-gray-600" />
          <input 
            type="file" 
            name="photo" 
            accept="image/*" 
            onChange={handlePhotoChange} 
            className="w-full bg-transparent focus:outline-none" 
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white font-bold p-4 rounded-lg hover:bg-blue-700 transition duration-300 text-xl shadow-md"
        >
          Submit for Verification
        </button>
      </form>
    </div>
  );
};

export default HireDoctor;