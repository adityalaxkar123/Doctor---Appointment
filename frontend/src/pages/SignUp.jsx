import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const SignUp= () => {
  const { backendUrl } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate()
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // console.log("sdas")
    try {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          password,
          email,
        });
        if (data.success) {
          toast.success("account created")
          navigate("/login")
        } else {
          toast.error(data.message);
        }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div
        className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 
    border rounded-xl text-zinc-600 text-sm shadow-lg"
      >
        <p className="text-2xl font-semibold">
          Create Account
        </p>
        <p>
          Please sign up to book appointment
        </p>
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              onChange={(e) => setName(e.target.value)}
              required
              value={name}
            />
          </div>

        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            value={email}
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="text"
            onChange={(e) => setPassword(e.target.value)}
            required
            value={password}
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base"
        >
          Create Account
        </button>
          <p>
            Already have an account?
            <span
              onClick={() => navigate('/login')}
              className="text-primary underline cursor-pointer"
            >
              Login here
            </span>
          </p>
      </div>
    </form>
  );
};

export default SignUp;
