import { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
const Navbar = () => {
  const navigate = useNavigate();

  const [showmenu, setShowmenu] = useState(false);
  const {token,setToken,userData} = useContext(AppContext)

  const logout = ()=>{
    setToken(false)
    localStorage.removeItem('token')
  }

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        src={assets.logo}
        onClick={()=> navigate('/')}
        alt=""
        className="
      w-44 cursor-pointer"
      />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1">HOME</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">ALL DOCTORS</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/store">
          <li className="py-1">STORE</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/awareness">
          <li className="py-1">DISEASE</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        {/* <NavLink to="/contact">
          <li className="py-1">CONTACT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink> */}
      </ul>
      <div className="flex items-center gap-4 ">
        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img src={userData.image} alt="" className="w-8 rounded-full" />
            <img src={assets.dropdown_icon} alt="" className="w-2.5" />
            <div
              className="absolute top-0 right-0 pt-14 text-base 
            font-medium text-gray-600 z-20 hidden group-hover:block"
            >
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointment")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointments
                </p>
                <p
                  onClick={() => navigate("/my-orders")}
                  className="hover:text-black cursor-pointer"
                >
                  My Orders
                </p>
                <p
                  onClick={logout}
                  className="hover:text-black cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/signup")}
            className="bg-primary text-white px-8 py-3 rounded-full 
        font-light hidden md:block"
          >
            Create Account
          </button>
        )}
        <img
        className="w-6 md:hidden"
         onClick={()=> setShowmenu(true)}
         src={assets.menu_icon} alt="" />
        {/*Mobile Menu */}
        <div className={`md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white
        ${showmenu ? 'fixed w-full':'h-0 w-0'} transition-all`}>
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={assets.logo} alt="" />
            <img className="w-7" onClick={()=> setShowmenu(false)} src={assets.cross_icon} alt="" />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink  onClick={()=> setShowmenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>Home</p></NavLink>
            <NavLink  onClick={()=> setShowmenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block'>All Doctors</p></NavLink>
            <NavLink  onClick={()=> setShowmenu(false)} to='/store'><p className='px-4 py-2 rounded inline-block'>Store</p></NavLink>
            <NavLink  onClick={()=> setShowmenu(false)} to='/awareness'><p className='px-4 py-2 rounded inline-block'>Awareness</p></NavLink>
            {/* <NavLink  onClick={()=> setShowmenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>Contact</p></NavLink> */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
