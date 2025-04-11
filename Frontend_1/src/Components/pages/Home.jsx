import React, { useState, useEffect } from "react";
import vectorImage from "../../assets/vehicle.jpg";
import { motion } from "framer-motion";

const Home = ({ setShowBillingForm }) => {
  const [displayedRate, setDisplayedRate] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null); // State for the calculated total amount
  const [visitorCount, setVisitorCount] = useState(0); // State for visitor count (center card)

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
    generateRandomVisitorCount(); // Initialize visitor count
  }, []);

  useEffect(() => {
    // Perform operations and calculate totalAmount whenever displayedRate changes
    if (displayedRate !== null) {
      const rate = parseFloat(displayedRate);
      const someFactor = 1.5; // Example factor for operation
      const calculatedTotal = rate * visitorCount * someFactor;
      setTotalAmount(calculatedTotal.toFixed(2)); // Format to 2 decimal places
    }
  }, [displayedRate, visitorCount]); // Re-run when displayedRate or visitorCount changes

  const generateRandomVisitorCount = () => {
    const randomVisitors = Math.floor(Math.random() * 100) + 50; // Random between 50 and 149
    setVisitorCount(randomVisitors);
  };

  const handleCardClick = (cardId) => {
    setActiveCard(activeCard === cardId ? null : cardId);
  };

  const cardBaseStyles = `
    absolute top-8 bg-white p-4 rounded-md shadow-md text-center cursor-pointer
    transition-all duration-300 ease-in-out
    z-10
    w-56 h-24
    transform-origin-top-center
  `;

  const cardActiveStyles = `
    z-20
    scale-110
    w-60 h-28
  `;

  const getCardPositionStyles = (cardId) => {
    switch (cardId) {
      case "vehicles":
        return `left-4 ${activeCard === "vehicles" ? 'translate-x-0' : ''}`;
      case "renewals":
        return `left-1/2 -translate-x-1/2 ${activeCard === "renewals" ? 'translate-y-0' : '-translate-y-2'}`;
      case "bills":
        return `right-4 ${activeCard === "bills" ? 'translate-x-0' : ''}`;
      default:
        return "";
    }
  };

  const getCardContentOpacity = (cardId) => {
    return activeCard === cardId ? 'opacity-100' : 'opacity-80';
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold mb-8 text-blue-600">
        Welcome to Vehicle Manager
      </h1>
      <img
        src={vectorImage}
        alt="Vehicle Manager"
        className="max-w-md rounded-lg shadow-lg mb-8"
      />
      <p className="text-lg text-gray-700 mb-4">
        Manage your vehicles and renewals with ease.
      </p>
      <p className="text-lg text-gray-700">
        Get started by using the sidebar navigation.
      </p>
    </motion.div>
  );
};

export default Home;