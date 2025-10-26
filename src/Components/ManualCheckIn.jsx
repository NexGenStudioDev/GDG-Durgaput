function ManualCheckIn({ manualID, setManualID, handleManualCheckIn }) {
  return (
    <div className="bg-white/90 h-[79.80%] w-full backdrop-blur-md p-6 rounded-2xl shadow-xl flex flex-col items-center">
      {/* Header */}
      <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1828/1828919.png"
          alt="Manual"
          className="w-8 h-8"
        />
        Manual Check-in ✍️
      </h2>

      {/* Description */}
      <p className="text-gray-600 mb-6 text-center text-sm">
        🚪 Enter your ID manually if QR scanning is not available. <br />
        Make sure your ID is correct before submitting!
      </p>

      {/* Input Field */}
      <div className="w-full mb-4">
        <label
          htmlFor="manualID"
          className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
        >
          <span>🔑 User ID</span>
        </label>
        <input
          id="manualID"
          type="text"
          placeholder="Enter your unique ID"
          value={manualID}
          onChange={e => setManualID(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleManualCheckIn}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium shadow-md transition-transform transform hover:scale-105"
      >
        ✅ Check In
      </button>

      {/* Additional Info */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>💡 Need help? Contact the event staff for assistance.</p>
        <p className="mt-2">🎉 Enjoy the event!</p>
      </div>
    </div>
  );
}

export default ManualCheckIn;
