import React, { useState, useEffect } from "react";
import vectorImage from "../../assets/vehicle.jpg";

const Home = ({ setShowBillingForm }) => {
  const [displayedRate, setDisplayedRate] = useState(null);

  // You might fetch the last bill rate from your backend when the component mounts
  useEffect(() => {
    const fetchLastBillRate = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bills/latest"); // Replace with your actual API endpoint
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
  }, []); // Empty dependency array means this runs once after the initial render

  const handleBillSubmit = (rate) => {
    setDisplayedRate(rate);
    // Optionally, you might want to trigger a re-fetch of the latest rate here
  };

  return (
    <div className="home-container flex flex-col items-center justify-center h-full relative bg-gray-100 p-8 rounded-lg shadow-md">
      {/* Card to display the rate at the top right */}
      <div className="rate-card absolute top-4 right-4 bg-white p-3 rounded-md shadow-sm text-sm">
        {displayedRate !== null ? (
          <p className="text-green-600 font-semibold">Last Bill Rate: ₹{displayedRate}</p>
        ) : (
          <p className="text-gray-500">No recent bills</p>
        )}
      </div>

      <h1 className="text-4xl font-bold mb-8 text-purple-700">
        Welcome to Vehicle Manager
      </h1>
      <img
        src={vectorImage} // Use the imported variable
        alt="Vehicle Manager"
        className="max-w-md rounded-lg shadow-lg mb-8"
      />
      <p className="text-lg text-gray-700 mb-4">
        Manage your vehicles and renewals with ease.
      </p>
      <p className="text-lg text-gray-700">
        Get started by using the sidebar navigation.
      </p>

      {/* You might not need to render BillingForm directly here anymore */}
      {/* {setShowBillingForm && <BillingForm onBillSubmit={handleBillSubmit} />} */}
    </div>
  );
};

export default Home;