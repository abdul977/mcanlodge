import React from 'react';

export const Header = () => {
  return (
    <div className="bg-gradient-to-r from-green-700 to-green-800 text-white p-6">
      <div className="flex justify-between items-center">
        {/* Logo container with specific positioning */}
        <div className="flex w-full justify-between items-center">
          {/* MCAN Logo on the left */}
          <img
            src="/mcan-logo.png"
            alt="MCAN Logo"
            className="h-16 w-auto"
          />
          {/* NYSC Logo on the right */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/8/87/NYSC_LOGO.svg"
            alt="NYSC Logo"
            className="h-16 w-auto"
          />
        </div>
      </div>
      <div className="text-center mt-4">
        <h1 className="text-2xl font-bold mb-2">Muslim Corpers' Association of Nigeria</h1>
        <h2 className="text-xl">FCT Chapter</h2>
        <p className="text-green-100 mt-2">Lodge Registration Form</p>
      </div>
    </div>
  );
};