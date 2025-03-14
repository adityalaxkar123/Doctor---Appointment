import { useContext } from "react";
import { OrderContext } from "../../context/OrderContext.jsx";
import { assets } from "../../assets/assets.js";
const Orders = () => {
  const { orders, cancelAdminOrder, totalEarnings, completeOrder } =
    useContext(OrderContext);
  return (
    <div className="m-5">
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.earning_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              ₹{totalEarnings}
            </p>
            <p className="text-gray-400">Earnings</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-5">
        <div className="flex items-center gap-2.5 px-4 py-4 bg-gray-100 border-b">
          <img src={assets.list_icon} alt="Orders" className="w-6 h-6" />
          <p className="font-semibold text-lg">All Bookings</p>
        </div>

        <div className="p-4">
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No bookings available.
            </p>
          ) : (
            orders
              .slice()
              .reverse()
              .map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row items-center md:items-start gap-4 p-4 border-b last:border-none hover:bg-gray-50 transition"
                >
                  <img
                    className="w-16 h-16 rounded-md object-cover"
                    src={item.medData?.image || assets.default_med_icon}
                    alt={item.medData?.name || "Medicine"}
                  />

                  <div className="flex-2">
                    <p className="text-gray-800 font-medium text-base">
                      {item.medData?.name}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Booked on: {new Date(item.orderDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Price: ₹{item.medData?.price || "N/A"}
                    </p>
                    <div>
                      <p className="text-xs inline border border-primary px-2 rounded-full">
                        {item.paymentStatus ? "Online" : "Cash"}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-gray-800 font-medium text-base">
                      {item.userData?.name || "Unknown User"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Email: {item.userData?.email || "N/A"}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Phone: {item.userData?.phone || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {!item.orderPlaced ? (
                      <p className="text-red-400 text-xs font-medium">
                        Cancelled
                      </p>
                    ) : item.orderDelivered ? (
                      <p className="text-green-500 text-xs font-medium">
                        Completed
                      </p>
                    ) : (
                      <div className="flex">
                        <button
                          onClick={() => cancelAdminOrder(item._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <img
                            className="w-6 h-6"
                            src={assets.cancel_icon}
                            alt="Cancel"
                          />
                        </button>
                        <button
                          onClick={() => completeOrder(item._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <img
                            className="w-6 h-6"
                            src={assets.tick_icon}
                            alt="Tick"
                          />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
