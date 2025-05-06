/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import vectorImage from "../../assets/vehicle.jpg"; // Make sure this path is correct
import { FaCar, FaUsers, FaMoneyBillAlt, FaTimesCircle, FaBell } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Reusable Skeleton Loader
const SkeletonLoader = ({ className = "h-8 w-24" }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${className}`}></div>
);

// Reusable Dashboard Card
const DashboardCard = ({
  id,
  icon: Icon,
  title,
  value,
  unit = "",
  isLoading,
  onClick,
  isActive,
  colorScheme = "gray",
  layoutId
}) => {
  const baseStyles = `
    relative bg-white p-5 rounded-xl shadow-md text-center cursor-pointer
    transition-all duration-300 ease-in-out
    z-10 w-full sm:w-64 md:w-60 lg:w-64
    h-36
    flex flex-col justify-center items-center
    border border-gray-200 overflow-hidden
    mb-4 md:m-2
    flex-shrink-0
  `;
  const activeStyles = `
    z-20 scale-105 md:scale-110 shadow-lg
    bg-gradient-to-br from-${colorScheme}-50 via-${colorScheme}-100 to-${colorScheme}-200
    border-${colorScheme}-300
  `;
  const colorClasses = {
    blue: { icon: "text-blue-500", title: "text-blue-700" },
    orange: { icon: "text-orange-500", title: "text-orange-700" },
    green: { icon: "text-green-500", title: "text-green-700" },
    gray: { icon: "text-gray-500", title: "text-gray-700" },
  };
  const colors = colorClasses[colorScheme] || colorClasses.gray;

  return (
    <motion.div
      layoutId={layoutId || id}
      className={`${baseStyles} ${isActive ? activeStyles : 'hover:shadow-lg hover:-translate-y-1'}`}
      onClick={() => onClick(id)}
      whileTap={{ scale: isActive ? 1.05 : 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Icon className={`${colors.icon} text-3xl mb-2`} />
        <h3 className={`text-md font-semibold ${colors.title} mb-1`}>{title}</h3>
        {isLoading ? (
          <SkeletonLoader className="h-7 w-20 mt-1" />
        ) : (
          <p className="text-2xl sm:text-3xl font-bold text-gray-800">
            {unit}{value ?? 'N/A'}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(error) { return { hasError: true, error: error }; }
    componentDidCatch(error, errorInfo) { console.error("Error caught by ErrorBoundary:", error, errorInfo); }
    render() {
        if (this.state.hasError) {
            return (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert">
                    <strong className="font-bold">Oops! Something went wrong.</strong>
                    <span className="block sm:inline"> Error displaying this section.</span>
                    {typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && this.state.error && (
                        <pre className="mt-2 text-xs">{this.state.error.toString()}</pre>
                    )}
                </div>
            );
        }
        return this.props.children;
    }
}

// Main Home Component
const Home = ({ renewalVehicles }) => {
  const [activeCard, setActiveCard] = useState(null);
  const [estimatedRevenue, setEstimatedRevenue] = useState(null);
  const [dailyActiveUsers, setDailyActiveUsers] = useState(0);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchData = async () => {
          setLoading(true);
          setError(null);
          setActiveCard(null);

          // *** Use your actual key if it's different from 'authToken' ***
          const token = localStorage.getItem('authToken');

          const authenticatedHeaders = {
              'Content-Type': 'application/json',
              'Authorization': token ? `Bearer ${token}` : null
          };
          const publicHeaders = {
              'Content-Type': 'application/json',
          };

          // Check if token exists FOR PROTECTED ROUTES.
          // You might still want to fetch public data even if token is missing,
          // but show an error indicating limited data.
          if (!token) {
              setError(new Error("Authentication token not found. Please log in to view full dashboard data."));
              // Optionally stop loading early if most data requires auth
              // setLoading(false);
              // return;
          }

          try {
              const results = await Promise.allSettled([
                  // Fetch Revenue Summary (PROTECTED)
                  fetch("http://localhost:5000/api/stats/revenue-summary", {
                      headers: authenticatedHeaders
                  }),
                  // Fetch Vehicle Count (PROTECTED)
                  fetch("http://localhost:5000/api/vehicles/count", {
                      headers: authenticatedHeaders
                  }),
                  // Fetch Daily Active Users (PUBLIC - per workaround)
                  fetch("http://localhost:5000/api/stats/daily-active-users", {
                      headers: publicHeaders // No auth header sent
                  })
              ]);

              // --- ADJUST indices based on new order ---
              const revenueResult = results[0];
              const vehicleCountResult = results[1];
              const activeUserResult = results[2];

              let fetchError = null;

              // Handle Revenue Summary Result
              if (revenueResult.status === 'fulfilled' && revenueResult.value.ok) {
                  const revenueData = await revenueResult.value.json();
                  setEstimatedRevenue(revenueData?.estimatedRevenue ?? null);
              } else if (revenueResult.status === 'fulfilled') {
                  const errorText = await revenueResult.value.text();
                  console.error(`Revenue Summary fetch failed: Status ${revenueResult.value.status} - ${errorText}`);
                  setEstimatedRevenue(null);
                  if (revenueResult.value.status === 401 || revenueResult.value.status === 403) {
                      fetchError = new Error("Authorization failed for fetching revenue summary.");
                  } else {
                      fetchError = new Error(`Server error fetching revenue (Status: ${revenueResult.value.status})`);
                  }
              } else {
                  console.error(`Network error fetching revenue: ${revenueResult.reason}`);
                  fetchError = new Error("Network error fetching revenue summary.");
              }

              // Handle Vehicle Count Result
              if (vehicleCountResult.status === 'fulfilled' && vehicleCountResult.value.ok) {
                  const countData = await vehicleCountResult.value.json();
                  setTotalVehicles(countData?.count ?? 0);
              } else if (vehicleCountResult.status === 'fulfilled') {
                  const errorText = await vehicleCountResult.value.text();
                  if (vehicleCountResult.value.status === 404) {
                      console.warn("Vehicle count endpoint 404. Setting count to 0.");
                      setTotalVehicles(0);
                  } else {
                      console.error(`Vehicle count fetch failed: Status ${vehicleCountResult.value.status} - ${errorText}`);
                      setTotalVehicles(0);
                      // Set the main error only if not already set by a previous failed request
                      if (!fetchError && (vehicleCountResult.value.status === 401 || vehicleCountResult.value.status === 403)) {
                          fetchError = new Error("Authorization failed for fetching vehicle count.");
                      } else if (!fetchError) {
                          fetchError = new Error(`Server error fetching vehicle count (Status: ${vehicleCountResult.value.status})`);
                      }
                  }
              } else {
                  console.error(`Network error fetching count: ${vehicleCountResult.reason}`);
                  if (!fetchError) fetchError = new Error("Network error fetching vehicle count.");
              }

              // Handle Active User Result
              if (activeUserResult.status === 'fulfilled' && activeUserResult.value.ok) {
                  const userData = await activeUserResult.value.json();
                  setDailyActiveUsers(userData?.count ?? 0);
              } else if (activeUserResult.status === 'fulfilled') {
                  const errorText = await activeUserResult.value.text();
                  console.error(`Active user fetch (public) failed: Status ${activeUserResult.value.status} - ${errorText}`);
                  setDailyActiveUsers(0);
                  // Set a general error only if no auth error occurred earlier
                  if (!fetchError) fetchError = new Error(`Failed to fetch active users (Status: ${activeUserResult.value.status})`);
              } else {
                  console.error(`Network error fetching active users: ${activeUserResult.reason}`);
                  if (!fetchError) fetchError = new Error("Network error fetching active users.");
              }

              if (fetchError) {
                setError(fetchError);
              }

          } catch (err) {
              console.error("General error during data fetch initiation:", err);
              setError(new Error("An unexpected network error occurred."));
              setEstimatedRevenue(null);
              setTotalVehicles(0);
              setDailyActiveUsers(0);
          } finally {
              setLoading(false);
          }
      };

      fetchData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect to Check Renewals
  useEffect(() => {
     const checkExpiringVehicles = () => {
         if (!Array.isArray(renewalVehicles) || renewalVehicles.length === 0) {
             setNotifications([]);
             return;
         }
         const today = new Date();
         today.setHours(0, 0, 0, 0);
         const tenDaysFromNow = new Date(today);
         tenDaysFromNow.setDate(today.getDate() + 10);

         const expiring = renewalVehicles.map(r => {
             if (!r.Expirydate || !r.vehiclenumber) return null;
             try {
                 const expiry = new Date(r.Expirydate);
                 if (isNaN(expiry.getTime())) return null; // Check if date is valid
                 expiry.setHours(0,0,0,0);

                 if (expiry <= tenDaysFromNow && expiry >= today) { // Check if expiry is within the next 10 days
                     return {
                         id: r._id || r.vehiclenumber + r.Expirydate, // Use _id if available
                         vehicleNumber: r.vehiclenumber,
                         expiryDate: expiry.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }),
                         rawExpiryDate: expiry // Keep raw date for sorting
                     };
                 }
                 return null;
             } catch (e) {
                 console.error(`Error processing date for renewal ${r.vehiclenumber}`, e);
                 return null;
             }
         }).filter(Boolean); // Remove null entries

         setNotifications(prev => {
             const existingIds = new Set(prev.map(n => n.id));
             const newlyExpiring = expiring.filter(n => !existingIds.has(n.id));
             const combined = [...prev, ...newlyExpiring];
             // Sort by closest expiry first, limit to 5 notifications
             return combined.sort((a, b) => a.rawExpiryDate - b.rawExpiryDate).slice(0, 5);
         });
     };

     checkExpiringVehicles();
     // Optionally set an interval to re-check periodically
     const intervalId = setInterval(checkExpiringVehicles, 3600000); // 1 hour
     return () => clearInterval(intervalId);

   }, [renewalVehicles]);

  const handleCardClick = (cardId) => {
      setActiveCard(activeCard === cardId ? null : cardId);
  };
  const handleCloseNotification = (id) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
  };
  const toggleNotificationBox = () => {
      setIsNotificationOpen(!isNotificationOpen);
  };

  if (error && !loading) {
      return (
          <div className="flex justify-center items-center min-h-screen p-4 sm:p-8">
              <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative max-w-xl text-center shadow-md" role="alert">
                  <strong className="font-bold block text-lg mb-2">Error Loading Dashboard</strong>
                  <span className="block sm:inline">Could not fetch required dashboard data.</span>
                  <p className="text-sm mt-2 text-red-600">{error.message}</p>
              </div>
          </div>
      );
  }

  return (
    <motion.div
      className="home-container flex flex-col items-center justify-start relative min-h-screen p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
        <div className="w-full max-w-5xl flex flex-col md:flex-row md:flex-wrap justify-center md:justify-around items-center mb-8 md:mb-12">
            <DashboardCard
                id="vehicles"
                icon={FaCar}
                title="Total Vehicles"
                value={totalVehicles}
                isLoading={loading}
                onClick={handleCardClick}
                isActive={activeCard === "vehicles"}
                colorScheme="blue"
            />
            <DashboardCard
                id="activeUsers"
                icon={FaUsers}
                title="Daily Active Users"
                value={dailyActiveUsers}
                isLoading={loading}
                onClick={handleCardClick}
                isActive={activeCard === "activeUsers"}
                colorScheme="orange"
            />
            {/* --- UPDATE Revenue Card --- */}
            <DashboardCard
                id="revenue"
                icon={FaMoneyBillAlt}
                title="Est. Net Revenue (Month)"
                value={estimatedRevenue}
                unit="₹"
                isLoading={loading}
                onClick={handleCardClick}
                isActive={activeCard === "revenue"}
                colorScheme="green"
            />
        </div>

        <motion.h1
          className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-gray-800 text-center"
          initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
        >
          Welcome to Vehicle Manager
        </motion.h1>
        <motion.img
          src={vectorImage} alt="Vehicle Manager Illustration"
          className="w-full max-w-[280px] sm:max-w-sm md:max-w-md rounded-lg shadow-lg mb-4 md:mb-6"
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
        />
        <motion.p
          className="text-base sm:text-lg text-gray-600 mb-2 text-center max-w-lg sm:max-w-xl"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}
        >
          Manage your vehicles, track renewals, and monitor activity efficiently.
        </motion.p>
        <motion.p
          className="text-sm sm:text-md text-gray-500 text-center max-w-lg sm:max-w-xl"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }}
        >
          Use the sidebar to navigate. Renewals expiring soon are in the notification bell.
        </motion.p>

        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
          <motion.div
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.0, type: "spring", stiffness: 200, damping: 15 }}
          >
              <motion.button
                onClick={toggleNotificationBox}
                className="bg-yellow-400 text-yellow-800 rounded-full p-3 shadow-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Notifications (${notifications.length} unread)`}
                aria-expanded={isNotificationOpen}
              >
                  <FaBell size={22} />
                  <AnimatePresence>
                      {notifications.length > 0 && (
                          <motion.span
                            key="notif-count"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                            className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                            aria-hidden="true"
                          >
                              {notifications.length}
                          </motion.span>
                      )}
                  </AnimatePresence>
              </motion.button>

              <AnimatePresence>
                  {isNotificationOpen && (
                      <motion.div
                        className="absolute bottom-full mb-2 right-0 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden w-[90vw] max-w-xs sm:w-80 max-h-96 flex flex-col"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        role="dialog"
                        aria-labelledby="notifications-heading"
                      >
                          <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                              <h5 id="notifications-heading" className="font-semibold text-gray-700 text-sm">Expiring Renewals (Next 10 Days)</h5>
                              <button onClick={toggleNotificationBox} className="text-gray-400 hover:text-gray-600" aria-label="Close notifications">
                                  <FaTimesCircle size={16} />
                              </button>
                          </div>
                          {notifications.length > 0 ? (
                              <ul className="overflow-y-auto flex-grow" aria-live="polite">
                                  <AnimatePresence initial={false}>
                                      {notifications.map((notification) => (
                                          <motion.li
                                            key={notification.id}
                                            layout // Animate layout changes when items are removed
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                                            className="px-3 py-2.5 border-b last:border-b-0 flex items-center justify-between hover:bg-gray-50 text-sm"
                                          >
                                              <div>
                                                  <p className="font-medium text-gray-800">{notification.vehicleNumber}</p>
                                                  <p className="text-xs text-red-600 font-medium">Expires: {notification.expiryDate}</p>
                                              </div>
                                              <motion.button
                                                onClick={() => handleCloseNotification(notification.id)}
                                                className="text-gray-400 hover:text-red-500 p-1 rounded-full flex-shrink-0 ml-2"
                                                whileHover={{ scale: 1.2 }}
                                                whileTap={{ scale: 0.9 }}
                                                aria-label={`Dismiss notification for ${notification.vehicleNumber}`}
                                              >
                                                  <FaTimesCircle size={16} />
                                              </motion.button>
                                          </motion.li>
                                      ))}
                                  </AnimatePresence>
                              </ul>
                          ) : (
                              <div className="p-4 text-gray-500 text-center text-sm flex-grow flex items-center justify-center">
                                  No renewals expiring soon.
                              </div>
                          )}
                      </motion.div>
                  )}
              </AnimatePresence>
          </motion.div>
        </div>
    </motion.div>
  );
};

// Wrapped Component with Error Boundary
const WrappedHome = ({ renewalVehicles }) => {
  return (
      <ErrorBoundary>
          <Home renewalVehicles={renewalVehicles} />
      </ErrorBoundary>
  );
};

export default WrappedHome;