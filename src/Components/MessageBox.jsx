function MessageBox({ message }) {
  return (
    <div className="mt-6 px-6 py-3 bg-white/70 rounded-lg shadow-md text-gray-800 font-medium animate-fade-in">
      {message}
    </div>
  );
}

export default MessageBox;
