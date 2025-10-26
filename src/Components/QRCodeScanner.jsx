import { useState, useCallback, useRef } from 'react';
import { QrReader } from 'react-qr-reader';

function QRCodeScanner({ showScanner, setShowScanner, handleScan, handleError }) {
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const lastScannedRef = useRef('');
  const errorCountRef = useRef(0);
  const maxErrorsRef = useRef(50);

  const handleResult = useCallback(
    (result, error) => {
      if (scanned || isProcessing) return;

      if (result?.text && result.text !== lastScannedRef.current) {
        setIsProcessing(true);
        lastScannedRef.current = result.text;
        setScanned(true);

        setTimeout(() => {
          handleScan(result);
          setIsProcessing(false);
        }, 100);
      } else if (error && !isProcessing) {
        const ignoredErrors = ['NotFoundException', 'ChecksumException', 'FormatException'];

        if (!ignoredErrors.includes(error.name)) {
          errorCountRef.current += 1;

          if (errorCountRef.current > maxErrorsRef.current) {
            console.error(
              'Too many critical QR decode errors, stopping scanner to prevent infinite loop'
            );
            setCameraError(
              'Scanner stopped due to repeated critical errors. Please refresh or try again.'
            );
            setShowScanner(false);
            return;
          }

          console.warn('QR decode error:', error);
        }
      }
    },
    [scanned, isProcessing, handleScan, setShowScanner]
  );

  const requestCamera = useCallback(async () => {
    setIsInitializing(true);
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      stream.getTracks().forEach(track => track.stop());

      setTimeout(() => {
        setShowScanner(true);
        setIsInitializing(false);
      }, 500);
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError(err.message);
      setIsInitializing(false);

      let errorMessage = 'Camera access denied. ';
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera access in your browser settings.';
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage += 'Camera not supported on this device.';
      } else {
        errorMessage += err.message;
      }

      alert(errorMessage);
      setShowScanner(false);
    }
  }, [setShowScanner]);

  const toggleScanner = useCallback(() => {
    if (isInitializing) return;

    setScanned(false);
    setIsProcessing(false);
    lastScannedRef.current = '';
    setCameraError(null);
    errorCountRef.current = 0;
    if (!showScanner) {
      requestCamera();
    } else {
      setShowScanner(false);
    }
  }, [showScanner, setShowScanner, requestCamera, isInitializing]);

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg flex flex-col items-center w-full">
      <h2 className="text-lg font-semibold mb-4 text-blue-700 flex items-center gap-2">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1048/1048953.png"
          alt="QR"
          className="w-6 h-6"
        />
        QR Code Scanner
      </h2>

      <p className="text-gray-600 mb-4 text-center text-sm">
        {isInitializing
          ? 'Initializing camera...'
          : cameraError
            ? `Error: ${cameraError}`
            : showScanner
              ? 'Position the QR code within the frame to scan.'
              : 'Click "Start Scanner" to activate the camera.'}
      </p>

      {showScanner ? (
        <div className="w-64 h-64 border-4 border-blue-400 rounded-xl overflow-hidden mb-4">
          <QrReader
            constraints={{
              facingMode: 'environment',
              width: { ideal: 640 },
              height: { ideal: 480 },
            }}
            videoId="qr-reader"
            videoContainerStyle={{ width: '100%', height: '100%' }}
            onResult={handleResult}
            onError={error => {
              console.warn('QR Reader error:', error);
              if (
                error.name === 'NotAllowedError' ||
                error.name === 'NotFoundError' ||
                error.name === 'NotSupportedError'
              ) {
                setCameraError('Camera initialization failed');
                setShowScanner(false);
              }
            }}
            containerStyle={{ width: '100%', height: '100%' }}
            videoStyle={{ objectFit: 'cover' }}
            scanDelay={500}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      ) : (
        <div className="w-64 h-64 border-2 border-dashed border-blue-300 rounded-xl flex items-center justify-center text-gray-400 mb-4">
          Camera is off
        </div>
      )}

      <button
        onClick={toggleScanner}
        disabled={isInitializing}
        className={`px-5 py-2 ${
          isInitializing
            ? 'bg-gray-400 cursor-not-allowed'
            : showScanner
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-blue-600 hover:bg-blue-700'
        } text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50`}
      >
        {isInitializing ? 'Initializing...' : showScanner ? 'Stop Scanner' : 'Start Scanner'}
      </button>
    </div>
  );
}

export default QRCodeScanner;
