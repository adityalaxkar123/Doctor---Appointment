import { useContext, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import { AppContext } from "../context/AppContext.jsx";
import {assets} from '../assets/assets.js'
// Default marker icon for doctors
const doctorIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Custom user location icon
const userIcon = L.icon({
  iconUrl: assets.green_location,
  iconSize: [50, 50],
  iconAnchor: [17, 35],
});

export default function Map() {
  const [userLocation, setUserLocation] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { backendUrl } = useContext(AppContext);

  // Fetch doctor data
  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/getDocData`);
      setDoctors(data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          console.log(position.coords.latitude)
          console.log(position.coords.longitude)
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getUserLocation();
    fetchDoctors();
  }, []);

  return (
    <div className="relative w-full px-4 mt-8">
      {/* Title Section */}
      <h2 className="text-center text-xl font-semibold text-gray-800 mb-4">
        Nearby Doctors
      </h2>

      <div className="relative bg-white p-4 shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <p className="text-center text-lg font-semibold">Loading map...</p>
        ) : (
          <div className="relative h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden">
            <MapContainer
              center={userLocation || [20.5937, 78.9629]} // Default to India if location is not available
              zoom={13}
              className="h-full w-full rounded-lg"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* User Location Marker with different icon */}
              {userLocation && (
                <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                  <Popup>
                    <span className="font-bold text-blue-600">You are here</span>
                  </Popup>
                </Marker>
              )}

              {/* Doctors' Locations with Default Icon */}
              {doctors.map((doctor, index) => (
                <Marker key={index} position={[doctor.lattitude, doctor.longitude]} icon={doctorIcon}>
                  <Popup>
                    <div className="text-center space-y-1">
                      <p className="text-lg font-bold text-blue-600 leading-tight">{doctor.name}</p>
                      <p className="text-sm font-semibold text-gray-700 leading-tight">{doctor.speciality}</p>
                      <p className="text-sm text-gray-500 leading-tight">
                        {doctor.address.line1}, {doctor.address.line2}
                      </p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${doctor.lattitude},${doctor.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center justify-center gap-2 px-3 py-1 text-xs font-semibold text-blue-600 bg-white border border-blue-600 rounded-lg shadow-sm hover:bg-blue-600 hover:text-white transition-all duration-300"
                      >
                        📍 Get Directions
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
}
