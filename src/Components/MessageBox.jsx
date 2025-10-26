function MessageBox({ message, onClear }) {
  return (
    <div className="mt-6 px-6 py-3 bg-white/70 rounded-lg shadow-md text-gray-800 font-medium animate-fade-in flex justify-between items-center">
      <span>{message}</span>
      {onClear && (
        <button
          onClick={onClear}
          className="ml-4 px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default MessageBox;
