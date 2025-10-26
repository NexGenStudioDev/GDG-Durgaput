import { useState, useCallback, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

function ZXingQRScanner({ showScanner, setShowScanner, handleScan, handleError }) {
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [isReaderReady, setIsReaderReady] = useState(false);
  const lastScannedRef = useRef('');
  const readerRef = useRef(null);
  const videoRef = useRef(null);
  const decodeStreamRef = useRef(null);

  // 🧩 Initialize ZXing reader
  useEffect(() => {
    const initializeReader = async () => {
      try {
        readerRef.current = new BrowserMultiFormatReader();
        setIsReaderReady(true);
      } catch (error) {
        console.error('Failed to initialize ZXing reader:', error);
        setCameraError('ZXing scanner not available. Please use React QR Reader instead.');
        setIsReaderReady(false);
      }
    };

    initializeReader();

    return () => {
      stopScanning();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🎥 Get available cameras
  const getCameras = useCallback(async () => {
    try {
      if (!readerRef.current) throw new Error('ZXing reader not ready yet');

      const videoInputDevices = await readerRef.current.listVideoInputDevices();
      setDevices(videoInputDevices);

      if (videoInputDevices.length > 0) {
        const backCamera = videoInputDevices.find(
          device =>
            device.label.toLowerCase().includes('back') ||
            device.label.toLowerCase().includes('rear')
        );
        setSelectedDeviceId(backCamera ? backCamera.deviceId : videoInputDevices[0].deviceId);
      } else {
        throw new Error('No camera devices found');
      }
    } catch (err) {
      console.error('Error getting cameras:', err);
      setDevices([{ deviceId: 'default', label: 'Default Camera' }]);
      setSelectedDeviceId('default');
    }
  }, []);

  // 🚀 Start scanning with fallback
  const startScanning = useCallback(async () => {
    if (!readerRef.current || !selectedDeviceId) return;

    setIsInitializing(true);
    setCameraError(null);

    try {
      console.log('Starting ZXing scanner...');
      const reader = readerRef.current;

      // Start decoding from the selected camera
      const decodeStream = await reader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, error) => {
          if (result && result.getText() && result.getText() !== lastScannedRef.current) {
            setIsProcessing(true);
            lastScannedRef.current = result.getText();
            setScanned(true);

            setTimeout(() => {
              handleScan({ text: result.getText() });
              setIsProcessing(false);
            }, 100);
          } else if (error && !isProcessing) {
            if (error.name !== 'NotFoundException') {
              console.warn('ZXing decode error:', error);
            }
          }
        }
      );

      decodeStreamRef.current = decodeStream;
      setIsInitializing(false);
      console.log('ZXing scanner started successfully ✅');
    } catch (err) {
      console.error('ZXing scanning error:', err);

      let errorMessage = '';
      if (err.name === 'OverconstrainedError') {
        errorMessage = 'Camera constraints not supported. Trying default camera...';

        // Fallback: retry with default camera (no constraints)
        try {
          const fallbackReader = readerRef.current;
          const decodeStream = await fallbackReader.decodeFromVideoDevice(
            null, // null = let browser pick best camera
            videoRef.current,
            (result, error) => {
              if (result && result.getText() && result.getText() !== lastScannedRef.current) {
                setIsProcessing(true);
                lastScannedRef.current = result.getText();
                setScanned(true);
                setTimeout(() => {
                  handleScan({ text: result.getText() });
                  setIsProcessing(false);
                }, 100);
              } else if (error && !isProcessing) {
                if (error.name !== 'NotFoundException') {
                  console.warn('ZXing decode error (fallback):', error);
                }
              }
            }
          );
          decodeStreamRef.current = decodeStream;
          console.log('Fallback camera started successfully ✅');
          setCameraError(null);
          setIsInitializing(false);
          return;
        } catch (fallbackError) {
          console.error('Fallback camera failed:', fallbackError);
          errorMessage = 'No compatible camera found.';
          setShowScanner(false);
        }
      } else if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera access denied. Please allow camera access.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device.';
      } else {
        errorMessage = err.message || 'Failed to start camera';
      }

      setCameraError(errorMessage);
      setIsInitializing(false);
      handleError && handleError({ message: errorMessage });
    }
  }, [selectedDeviceId, handleScan, isProcessing, handleError, setShowScanner]);

  // 🧹 Stop scanning
  const stopScanning = useCallback(() => {
    try {
      if (decodeStreamRef.current && typeof decodeStreamRef.current.reset === 'function') {
        decodeStreamRef.current.reset();
        decodeStreamRef.current = null;
      }
    } catch (err) {
      console.warn('Error stopping scanner:', err);
    }
    setShowScanner(false);
  }, [setShowScanner]);

  // 🔁 Toggle scanner on/off
  const toggleScanner = useCallback(() => {
    if (isInitializing || !isReaderReady) return;

    setScanned(false);
    setIsProcessing(false);
    lastScannedRef.current = '';
    setCameraError(null);

    if (!showScanner) {
      if (devices.length === 0) {
        getCameras().then(startScanning);
      } else {
        startScanning();
      }
      setShowScanner(true);
    } else {
      stopScanning();
    }
  }, [
    showScanner,
    isInitializing,
    isReaderReady,
    devices.length,
    getCameras,
    startScanning,
    stopScanning,
    setShowScanner,
  ]);

  // 📸 Load cameras when ready
  useEffect(() => {
    if (isReaderReady) {
      getCameras();
    }
  }, [isReaderReady, getCameras]);

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4 text-blue-700 flex items-center gap-2">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1048/1048953.png"
          alt="QR"
          className="w-6 h-6"
        />
        QR Code Scanner (ZXing)
      </h2>

      <p className="text-gray-600 mb-4 text-center text-sm">
        {!isReaderReady
          ? 'Initializing QR scanner...'
          : isInitializing
            ? 'Initializing camera...'
            : cameraError
              ? `Error: ${cameraError}`
              : showScanner
                ? 'Position the QR code within the frame to scan.'
                : 'Click "Start Scanner" to activate the camera.'}
      </p>

      {showScanner ? (
        <div className="w-64 h-64 border-4 border-blue-400 rounded-xl overflow-hidden mb-4">
          <video
            ref={videoRef}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            playsInline
            muted
          />
        </div>
      ) : (
        <div className="w-64 h-64 border-2 border-dashed border-blue-300 rounded-xl flex items-center justify-center text-gray-400 mb-4">
          Camera is off
        </div>
      )}

      <button
        onClick={toggleScanner}
        disabled={isInitializing || !isReaderReady}
        className={`px-5 py-2 ${
          isInitializing || !isReaderReady
            ? 'bg-gray-400 cursor-not-allowed'
            : showScanner
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-blue-600 hover:bg-blue-700'
        } text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50`}
      >
        {!isReaderReady
          ? 'Initializing...'
          : isInitializing
            ? 'Initializing...'
            : showScanner
              ? 'Stop Scanner'
              : 'Start Scanner'}
      </button>
    </div>
  );
}

export default ZXingQRScanner;
