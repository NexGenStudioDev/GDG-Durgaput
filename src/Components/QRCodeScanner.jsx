import { useEffect, useRef } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';

function QRCodeScanner({ showScanner, setShowScanner, handleScan, handleError }) {
  const videoRef = useRef(null);
  const codeReader = useRef(null);

  useEffect(() => {
    codeReader.current = new BrowserQRCodeReader();

    if (showScanner) {
      // Start the scanner
      codeReader.current.decodeFromVideoDevice(null, videoRef.current, (result, error) => {
        if (result) {
          handleScan(result);
        }
        if (error) {
          handleError(error);
        }
      });
    } else {
      // Stop the scanner and release the camera
      if (codeReader.current) {
        codeReader.current.reset();
        console.log('Scanner stopped and camera released.');
      }
    }

    return () => {
      // Cleanup: Ensure the scanner is reset when the component unmounts
      if (codeReader.current) {
        codeReader.current.reset();
        console.log('Scanner cleaned up on unmount.');
      }
    };
  }, [showScanner, handleScan, handleError]);

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4 text-blue-700 flex items-center gap-2">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1048/1048953.png"
          alt="QR"
          className="w-6 h-6"
        />
        QR Code Scanner
      </h2>
      <p className="text-gray-600 mb-4 text-center text-sm">
        {showScanner
          ? 'Scan your QR code for instant check-in'
          : 'Click "Start Scanner" to activate the camera'}
      </p>
      {showScanner ? (
        <div className="w-64 h-64 border-4 border-blue-400 rounded-xl overflow-hidden mb-4">
          <video ref={videoRef} className="w-full h-full" />
        </div>
      ) : (
        <div className="w-64 h-64 border-2 border-dashed border-blue-300 rounded-xl flex items-center justify-center text-gray-400 mb-4">
          Camera is off
        </div>
      )}
      <button
        onClick={() => setShowScanner(!showScanner)}
        className={`px-5 py-2 ${
          showScanner ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
        } text-white rounded-xl font-medium transition-all duration-300`}
      >
        {showScanner ? 'Stop Scanner' : 'Start Scanner'}
      </button>
    </div>
  );
}

export default QRCodeScanner;