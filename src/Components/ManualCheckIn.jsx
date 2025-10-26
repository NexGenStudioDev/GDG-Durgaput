function ManualCheckIn({ manualID, setManualID, handleManualCheckIn }) {
  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4 text-blue-700 flex items-center gap-2">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1828/1828919.png"
          alt="Manual"
          className="w-6 h-6"
        />
        Manual Check-in
      </h2>
      <p className="text-gray-600 mb-4 text-center text-sm">
        Enter your ID manually if QR scanning is not available
      </p>
      <input
        type="text"
        placeholder="Enter your unique ID"
        value={manualID}
        onChange={e => setManualID(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
      />
      <button
        onClick={handleManualCheckIn}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-300"
      >
        ✓ Check In
      </button>
    </div>
  );
}

export default ManualCheckIn;
