import { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext.jsx";

const LabReport = () => {
  const { dToken, appointments, getAppointments } = useContext(DoctorContext);

  useEffect(() => {
    if (dToken) getAppointments();
  }, [dToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">Lab Reports</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_5fr] gap-1 py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p className="text-right">Lab Report</p>
        </div>
        {appointments.map((item, index) => (
          <div
            key={index}
            className="flex flex-wrap sm:grid sm:grid-cols-[0.5fr_2fr_5fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
          >

            <p className="hidden sm:block">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img className="w-10 h-10 rounded-full" src={item.userData.image} alt="User" />
              <p className="font-medium">{item.userData.name}</p>
            </div>

            <div className="w-full sm:w-auto flex justify-end">
              {!item.isCompleted && !item.cancelled && item.userData.labFile ? (
                <a href={item.userData.labFile} target="_blank" rel="noopener noreferrer">
                  <img
                    className="w-32 h-32 object-cover rounded-lg border shadow-md cursor-pointer hover:scale-105 transition-transform"
                    src={item.userData.labFile}
                    alt="Lab Report"
                  />
                </a>
              ) : item.isCompleted ?
              <p className="text-green-500 text-xs font-medium">Completed</p>

               : item.cancelled ? 
               <p className="text-red-500 text-right">Cancelled</p>
               :
               (
                <p className="text-red-500 text-right">No Report Available</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabReport;
