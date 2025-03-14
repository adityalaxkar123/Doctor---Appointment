// import React from 'react'

import { useState } from "react";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";
const AddMedicine = () => {
  const [medImg, setMedImg] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [mg, setMg] = useState(0);

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!medImg) {
        return toast.error("Image not selected");
      }

      const formData = new FormData();

      formData.append("image", medImg);
      formData.append("name", name);
      formData.append("category", category);
      formData.append("price", Number(price));
      formData.append("mg", Number(mg));

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-medicine",
        formData,
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setMedImg(false);
        setName("");
        setCategory("");
        setPrice(0);
        setMg(0);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>
      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="med-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={medImg ? URL.createObjectURL(medImg) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setMedImg(e.target.files[0])}
            type="file"
            id="med-img"
            hidden
          />
          <p>
            Upload Medicine <br />
            picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Medicine name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                className="border rounded px-3 py-2"
                type="text"
                placeholder=" Name"
                value={name}
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Medicine category</p>
              <input
                onChange={(e) => setCategory(e.target.value)}
                className="border rounded px-3 py-2"
                type="text"
                value={category}
                placeholder=" Category"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Medicine price</p>
              <input
                onChange={(e) => setPrice(e.target.value)}
                className="border rounded px-3 py-2"
                type="Number"
                value={price}
                placeholder=" Price"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary px-10 py-3 mt-4 text-white rounded-full"
        >
          Add Medicine
        </button>
      </div>
    </form>
  );
};

export default AddMedicine;
