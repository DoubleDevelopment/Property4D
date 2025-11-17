import React from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const handleClick = () => toast("Hello world!");
  
  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <button
        className="px-6 py-3 bg-yellow-500 rounded hover:bg-yellow-600 transition"
        onClick={handleClick}
      >
        Show Toast
      </button>
      <ToastContainer />
    </div>
  );
}

export default App;
