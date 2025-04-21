/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import vectorImage from "../../assets/vehicle.jpg";
import { motion } from "framer-motion";
import { FaCar, FaUsers, FaMoneyBillAlt, FaTimesCircle, FaBell } from 'react-icons/fa'; // Import bell icon

const Home = ({ renewalVehicles }) => {
    const [displayedRate, setDisplayedRate] = useState(null);
    const [activeCard, setActiveCard] = useState(null);
    const [totalAmount, setTotalAmount] = useState(null);
    const [visitorCount, setVisitorCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [totalVehicles, setTotalVehicles] = useState(0); // New state for total vehicles

    useEffect(() => {
        const fetchLastBillRate = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/bills/latest");
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.rate) {
                        setDisplayedRate(data.rate);
                    }
                } else {
                    console.error("Failed to fetch latest bill rate");
                }
            } catch (error) {
                console.error("Error fetching latest bill rate:", error);
            }
        };

        const fetchVehicleCount = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/vehicles/count");
                if (response.ok) {
                    const data = await response.json();
                    setTotalVehicles(data.count);
                } else {
                    console.error("Failed to fetch vehicle count");
                }
            } catch (error) {
                console.error("Error fetching vehicle count:", error);
            }
        };

        fetchLastBillRate();
        fetchVehicleCount();
        generateRandomVisitorCount();
    }, []);

    useEffect(() => {
        if (displayedRate !== null) {
            const rate = parseFloat(displayedRate);
            const someFactor = 1.5;
            const calculatedTotal = rate * visitorCount * someFactor;
            setTotalAmount(calculatedTotal.toFixed(2));
        }
    }, [displayedRate, visitorCount]);

    useEffect(() => {
        const checkExpiringVehicles = () => {
            if (renewalVehicles && renewalVehicles.length > 0) {
                const today = new Date();
                const tenDaysFromNow = new Date(today);
                tenDaysFromNow.setDate(today.getDate() + 10);

                const newExpiringVehicles = [];
                renewalVehicles.forEach((renewal) => {
                    const expiryDate = new Date(renewal.Expirydate);
                    if (expiryDate <= tenDaysFromNow && expiryDate >= today) {
                        newExpiringVehicles.push({
                            id: renewal.vehiclenumber, // Use vehicle number as a unique ID
                            vehicleNumber: renewal.vehiclenumber,
                            expiryDate: expiryDate.toLocaleDateString(),
                        });
                    }
                });

                // Update notifications, adding new ones if they don't exist (max 4)
                setNotifications((prevNotifications) => {
                    const existingIds = prevNotifications.map(n => n.id);
                    const newNotifications = newExpiringVehicles.filter(n => !existingIds.includes(n.id));
                    return [...prevNotifications, ...newNotifications].slice(0, 4); // Limit to max 4
                });
            } else {
                setNotifications([]); // Clear notifications if no renewal data
            }
        };

        checkExpiringVehicles();
        const intervalId = setInterval(checkExpiringVehicles, 60 * 60 * 1000);
        return () => clearInterval(intervalId);

    }, [renewalVehicles]);

    const generateRandomVisitorCount = () => {
        const randomVisitors = Math.floor(Math.random() * 100) + 50;
        setVisitorCount(randomVisitors);
    };

    const handleCardClick = (cardId) => {
        setActiveCard(activeCard === cardId ? null : cardId);
    };

    const handleCloseNotification = (notificationId) => {
        setNotifications((prevNotifications) =>
            prevNotifications.filter((notification) => notification.id !== notificationId)
        );
    };

    const toggleNotificationBox = () => {
        setIsNotificationOpen(!isNotificationOpen);
    };

    const cardBaseStyles = `
        absolute top-8 bg-white p-5 rounded-xl shadow-md text-center cursor-pointer
        transition-all duration-300 ease-in-out
        z-10
        w-64 h-32
        transform-origin-top-center
        hover:shadow-lg hover:scale-105
        flex flex-col justify-center items-center
        border border-gray-200
    `;

    const cardActiveStyles = `
        z-20
        scale-110
        w-72 h-36
        bg-gradient-to-br from-purple-100 to-blue-100
        border-purple-300
    `;

    const getCardPositionStyles = (cardId) => {
        switch (cardId) {
            case "vehicles":
                return `left-8 ${activeCard === "vehicles" ? 'translate-x-0' : ''}`;
            case "renewals":
                return `left-1/2 -translate-x-1/2 ${activeCard === "renewals" ? 'translate-y-0' : '-translate-y-4'}`;
            case "bills":
                return `right-8 ${activeCard === "bills" ? 'translate-x-0' : ''}`;
            default:
                return "";
        }
    };

    const getCardContentOpacity = (cardId) => {
        return activeCard === cardId ? 'opacity-100' : 'opacity-80';
    };

    return (
        <motion.div
            className="home-container flex flex-col items-center justify-start relative h-full p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Left Top Card - Total Vehicles */}
            <motion.div
                className={`${cardBaseStyles} ${getCardPositionStyles("vehicles")} ${activeCard === "vehicles" ? cardActiveStyles : ''}`}
                onClick={() => handleCardClick("vehicles")}
                layout
            >
                <div className={`${getCardContentOpacity("vehicles")} flex flex-col items-center justify-center`}>
                    <FaCar className="text-blue-500 text-3xl mb-1" />
                    <h3 className="text-lg font-semibold text-blue-700 mb-1">Total Vehicles</h3>
                    <p className="text-3xl font-bold text-gray-800">{totalVehicles}</p>
                </div>
            </motion.div>

            {/* Center Top Card - Visitor Counts */}
            <motion.div
                className={`${cardBaseStyles} ${getCardPositionStyles("renewals")} ${activeCard === "renewals" ? cardActiveStyles : ''}`}
                onClick={() => handleCardClick("renewals")}
                layout
            >
                <div className={`${getCardContentOpacity("renewals")} flex flex-col items-center justify-center`}>
                    <FaUsers className="text-orange-500 text-3xl mb-1" />
                    <h3 className="text-lg font-semibold text-orange-700 mb-1">Visitor Counts</h3>
                    <p className="text-3xl font-bold text-gray-800">{visitorCount}</p>
                </div>
            </motion.div>

            {/* Right Top Card - Calculated Total Amount */}
            <motion.div
                className={`${cardBaseStyles} ${getCardPositionStyles("bills")} ${activeCard === "bills" ? cardActiveStyles : ''}`}
                onClick={() => handleCardClick("bills")}
                layout
            >
                <div className={`${getCardContentOpacity("bills")} flex flex-col items-center justify-center`}>
                    <FaMoneyBillAlt className="text-green-500 text-3xl mb-1" />
                    <h3 className="text-sm font-semibold text-green-700 mb-1">Calculated Total</h3>
                    <p className="text-2xl font-bold text-gray-800">
                        {totalAmount !== null ? `₹${totalAmount}` : "₹0.00"}
                    </p>
                </div>
            </motion.div>

            <motion.h1
                className="text-4xl font-bold mt-32 mb-8 text-purple-800 shadow-sm"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                Welcome to Vehicle Manager
            </motion.h1>
            <motion.img
                src={vectorImage}
                alt="Vehicle Manager"
                className="max-w-md rounded-lg shadow-lg mb-8"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            />
            <motion.p
                className="text-lg text-gray-700 mb-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                Manage your vehicles and renewals with ease.
            </motion.p>
            <motion.p
                className="text-lg text-gray-700 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                Get started by using the sidebar navigation.
            </motion.p>

            <div className="fixed bottom-12 right-8 z-50"> {/* Adjusted right value to 8 for -2 */}
                <motion.div
                    className="relative"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                >
                    <button
                        onClick={toggleNotificationBox}
                        className="bg-yellow-200 border border-yellow-500 rounded-full p-2 shadow-md hover:bg-yellow-300"
                    >
                        <FaBell className="text-yellow-700" size={20} />
                        {notifications.length > 0 && (
                            <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                                {notifications.length}
                            </span>
                        )}
                    </button>

                    {isNotificationOpen && (
                        <motion.div
                            className="absolute bottom-full mb-2 right-0 bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden w-80"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="p-4 border-b">
                                <h5 className="font-semibold">Expiring Renewals</h5>
                            </div>
                            {notifications.length > 0 ? (
                                <ul className="overflow-y-auto max-h-60">
                                    {notifications.map((notification) => (
                                        <li key={notification.id} className="p-3 border-b last:border-b-0 flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-semibold">{notification.vehicleNumber}</p>
                                                <p className="text-xs text-gray-600">Expires: {notification.expiryDate}</p>
                                            </div>
                                            <button
                                                onClick={() => handleCloseNotification(notification.id)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <FaTimesCircle size={16} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-4 text-gray-700 text-center">No expiring renewals.</div>
                            )}
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Home;