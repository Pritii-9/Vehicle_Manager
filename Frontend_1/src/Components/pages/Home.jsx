/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import vectorImage from "../../assets/vehicle.jpg";
import { motion } from "framer-motion";
import { FaCar, FaUsers, FaMoneyBillAlt } from 'react-icons/fa'; // Import icons

const Home = () => {
  const [displayedRate, setDisplayedRate] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const [visitorCount, setVisitorCount] = useState(0);

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

    fetchLastBillRate();
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

  const generateRandomVisitorCount = () => {
    const randomVisitors = Math.floor(Math.random() * 100) + 50;
    setVisitorCount(randomVisitors);
  };

  const handleCardClick = (cardId) => {
    setActiveCard(activeCard === cardId ? null : cardId);
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
      className="home-container flex flex-col items-center justify-center h-full relative bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-lg shadow-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left Top Card - Total */}
      <motion.div
        className={`${cardBaseStyles} ${getCardPositionStyles("vehicles")} ${activeCard === "vehicles" ? cardActiveStyles : ''}`}
        onClick={() => handleCardClick("vehicles")}
        layout
      >
        <div className={`${getCardContentOpacity("vehicles")} flex flex-col items-center justify-center`}>
          <FaCar className="text-blue-500 text-3xl mb-1" />
          <h3 className="text-lg font-semibold text-blue-700 mb-1">Total</h3>
          <p className="text-3xl font-bold text-gray-800">-</p>
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
        className="text-4xl font-bold mb-8 text-purple-800 shadow-sm"
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
    </motion.div>
  );
};

export default Home;