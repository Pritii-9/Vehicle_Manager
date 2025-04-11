import React from "react";
import vectorImage from "../../assets/vehicle.jpg"

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
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
    </div>
  );
};

export default Home;