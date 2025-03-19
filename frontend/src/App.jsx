import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Contact from "./pages/Contact"
import MyProfile from "./pages/MyProfile"
import MyAppointments from './pages/MyAppointments'
import Doctors from "./pages/Doctors"
import Login from "./pages/Login"
import Appointments from './pages/Appointments'
import Navbar from "./components/Navbar"
import Footer from './components/Footer'
import {ToastContainer} from 'react-toastify'
import Store from "./pages/Store.jsx"
import Medicine from "./pages/Medicine.jsx"
import MyOrders from './pages/Myorders.jsx'
import SignUp from "./pages/SignUp.jsx"
import Privacy from "./pages/Privacy.jsx"
import Chatbot from "./pages/Chatbot.jsx"
import Awareness from "./pages/Awareness.jsx"
import HireDoctor from "./pages/HireDoctor.jsx"
// import 'react-toastify/dist/ReactTostify.css'
const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer/>

      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/store" element={<Store/>} />
        <Route path="/store/:category" element={<Store />} />
        <Route path="/medicine/:medicineId" element={<Medicine />} />
        <Route path="/doctors" element={<Doctors/>} />
        <Route path="/doctors/:speciality" element={<Doctors/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/about" element={<About/>} />
         <Route path="/awareness" element={<Awareness/>} /> 
        <Route path="/privacy" element={<Privacy/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/hire-doctor" element={<HireDoctor/>} />
        <Route path="/my-appointment" element={<MyAppointments/>} />
        <Route path="/my-orders" element={<MyOrders/>} />
        <Route path="/my-profile" element={<MyProfile/>} />
        <Route path="/appointment/:docId" element={<Appointments/>} />
      </Routes>
      <Chatbot/>
      <Footer/>
    </div>
  )
}

export default App
