function Header() {
  return (
    <div className="static top-0 w-full flex justify-between items-center bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-lg mb-8">
      <div className="flex items-center gap-3">
        <img
          src="https://cdn-icons-png.flaticon.com/512/5968/5968871.png"
          alt="GDG Logo"
          className="w-10 h-10"
        />
        <div>
          <h1 className="text-xl font-bold text-gray-900">GDG Durgapur</h1>
          <p className="text-sm text-gray-600">Attendance System</p>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          ● Ready
        </span>
        <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-medium shadow">
          DEVFEST 2025
        </span>
      </div>
    </div>
  );
}

export default Header;
