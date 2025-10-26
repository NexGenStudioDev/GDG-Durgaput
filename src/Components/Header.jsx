import { CheckCircle, Calendar } from 'lucide-react';

function Header() {
  return (
    <header className="sticky top-0 z-50 w-[90%] max-w-6xl mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white/40 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-lg mb-6 transition-all duration-300">
      {/* Left section — logo and text */}
      <div className="flex items-center gap-3 mb-3 sm:mb-0">
        <img
          src="https://cdn-icons-png.flaticon.com/512/5968/5968871.png"
          alt="GDG Logo"
          className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
        />
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">GDG Durgapur</h1>
          <p className="text-xs sm:text-sm text-gray-600">Attendance System</p>
        </div>
      </div>

      {/* Right section — badges/icons */}
      <div className="flex flex-wrap justify-center sm:justify-end gap-3 items-center">
        {/* Mobile view: show icons only */}
        <div className="flex sm:hidden gap-3 text-gray-700">
          <CheckCircle className="text-green-600 w-5 h-5" title="Ready" />
          <Calendar className="text-orange-500 w-5 h-5" title="DevFest 2025" />
        </div>

        {/* Desktop view: show full badges */}
        <div className="hidden sm:flex flex-wrap justify-end gap-3 items-center">
          <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
            ● Ready
          </span>
          <span className="px-2 sm:px-3 py-1 bg-orange-500 text-white rounded-full text-xs sm:text-sm font-medium shadow whitespace-nowrap">
            DEVFEST 2025
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;
