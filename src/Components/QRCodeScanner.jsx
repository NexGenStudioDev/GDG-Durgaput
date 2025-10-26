import { useState } from 'react';
import { QrReader } from 'react-qr-reader';

function QRCodeScanner({ showScanner, setShowScanner, handleScan, handleError }) {
  const [scanned, setScanned] = useState(false);

  const handleResult = (result, error) => {
    if (scanned) return; // prevent multiple triggers

    if (result?.text) {
      setScanned(true);
      handleScan(result.text);
    } else if (error) {
      // Only log non-critical errors to avoid crashing
      console.warn('QR decode error:', error);
      handleError && handleError(error);
    }
  };

  const requestCamera = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setShowScanner(true);
    } catch (err) {
      console.error('Camera access denied:', err);
      alert('Please allow camera access to scan QR codes.');
      setShowScanner(false);
    }
  };

  const toggleScanner = () => {
    setScanned(false);
    if (!showScanner) {
      requestCamera();
    } else {
      setShowScanner(false);
    }
  };

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
          ? 'Position the QR code within the frame to scan.'
          : 'Click "Start Scanner" to activate the camera.'}
      </p>

      {showScanner ? (
        <div className="w-64 h-64 border-4 border-blue-400 rounded-xl overflow-hidden mb-4">
          <QrReader
            constraints={{ facingMode: 'environment', width: 640, height: 480 }}
            videoId="qr-reader"
            videoContainerStyle={{ width: '100%', height: '100%' }}
            onResult={handleResult}
            containerStyle={{ width: '100%', height: '100%' }}
            videoStyle={{ objectFit: 'cover' }}
          />
        </div>
      ) : (
        <div className="w-64 h-64 border-2 border-dashed border-blue-300 rounded-xl flex items-center justify-center text-gray-400 mb-4">
          Camera is off
        </div>
      )}

      <button
        onClick={toggleScanner}
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
