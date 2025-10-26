import { useState, useCallback } from 'react';
import Header from './Components/Header';
import QRCodeScanner from './Components/QRCodeScanner';
import ZXingQRScanner from './Components/ZXingQRScanner';
import ManualCheckIn from './Components/ManualCheckIn';
import MessageBox from './Components/MessageBox';

export default function GDGAttendance() {
  const [data, setData] = useState('');
  const [manualID, setManualID] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [message, setMessage] = useState('');
  const [useZXingScanner, setUseZXingScanner] = useState(true);
  const [zxingAvailable, setZxingAvailable] = useState(true);

  const handleScan = useCallback(result => {
    if (result?.text) {
      setData(result.text);
      setMessage(`✅ Successfully Checked In: ${result.text}`);
      setShowScanner(false);
    }
  }, []);

  const handleManualCheckIn = useCallback(() => {
    if (manualID.trim() === '') {
      setMessage('⚠️ Please enter a valid User ID.');
    } else {
      setMessage(`✅ Successfully Checked In: ${manualID}`);
      setManualID('');
    }
  }, [manualID]);

  const handleError = useCallback(err => {
    console.error(err);
    setMessage(err?.message || '❌ Error accessing camera');
    setShowScanner(false);
  }, []);

  const handleZXingError = useCallback(
    err => {
      console.error('ZXing error:', err);
      if (err?.message?.includes('ZXing scanner not available')) {
        setZxingAvailable(false);
        setUseZXingScanner(false);
        setMessage('ZXing scanner not available. Switched to React QR Reader.');
      } else if (err?.message?.includes('Camera constraints not supported')) {
        setZxingAvailable(false);
        setUseZXingScanner(false);
        setMessage(
          'ZXing camera constraints not supported. Automatically switched to React QR Reader.'
        );
      } else {
        handleError(err);
      }
    },
    [handleError]
  );

  const clearMessage = useCallback(() => {
    setMessage('');
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col  bg-gradient-to-br from-blue-500 to-green-400 p-6 text-gray-800">
      <Header />
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
        <div>
          {useZXingScanner && zxingAvailable ? (
            <ZXingQRScanner
              showScanner={showScanner}
              setShowScanner={setShowScanner}
              handleScan={handleScan}
              handleError={handleZXingError}
            />
          ) : (
            <QRCodeScanner
              showScanner={showScanner}
              setShowScanner={setShowScanner}
              handleScan={handleScan}
              handleError={handleError}
            />
          )}

          <div className="mt-4 flex flex-col items-center gap-2">
            <button
              onClick={() => {
                setUseZXingScanner(!useZXingScanner);
                setShowScanner(false);
                setMessage('');
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
            >
              Switch to {useZXingScanner ? 'React QR Reader' : 'ZXing Scanner'}
            </button>
            {!useZXingScanner && (
              <p className="text-xs text-orange-600 text-center">
                ⚠️ React QR Reader may have issues. ZXing Scanner is recommended.
              </p>
            )}
            {!zxingAvailable && (
              <p className="text-xs text-red-600 text-center">
                ❌ ZXing Scanner is not available in this browser.
              </p>
            )}
          </div>
        </div>

        <ManualCheckIn
          manualID={manualID}
          setManualID={setManualID}
          handleManualCheckIn={handleManualCheckIn}
        />
      </div>
      {message && <MessageBox message={message} onClear={clearMessage} />}
    </div>
  );
}
