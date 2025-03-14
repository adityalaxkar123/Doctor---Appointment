import { createContext } from "react";
import axios from 'axios'
import { useState } from "react";
import { useEffect } from "react";
import {toast} from 'react-toastify'



export const AppContext = createContext()



const AppContextProvider =(props)=>{
    const currencySymbol = "$"

    const [userData,setUserData] = useState(false)
    const [token,setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [doctors,setDoctors] = useState([])
    const [medicines,setMedicines] = useState([])
    const getDoctorsData = async()=>{
        try {
        const {data} = await axios.get(backendUrl + '/api/doctor/list')
        if(data.success){
            setDoctors(data.doctors)
        }else{
            toast.error(data.message)
        }           
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    const getMedicineData = async()=>{
        try {
        const {data} = await axios.get(backendUrl + '/api/admin/medicine-list')
        if(data.success){
            setMedicines(data.medicines)
            // console.log(data.medicines)
        }else{
            toast.error(data.message)
        }           
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    useEffect(()=>{
        getDoctorsData()
        getMedicineData()
    },[])

    const loadUserProfileData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/user/get-profile',{headers:{token}})
            if(data.success){
                setUserData(data.userData)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }



    useEffect(()=>{
        if(token){
            loadUserProfileData()
        }else{
            setUserData(false)

        }
    },[token])

    const value = {
        doctors,currencySymbol,
        getDoctorsData,
        token,setToken,
        backendUrl,userData,
        setUserData,
        loadUserProfileData,
        medicines,
        setMedicines,
        getMedicineData
        
    }
    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider