import { useState, useCallback } from 'react';
import logo from '../src/assets/image-removebg-preview.png';
import Header from './Components/Header';
import QRCodeScanner from './Components/QRCodeScanner';
import ZXingQRScanner from './Components/ZXingQRScanner';
import ManualCheckIn from './Components/ManualCheckIn';
import MessageBox from './Components/MessageBox';
import Particles from './Components/Particles';

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
    <div
      className="relative h-screen w-full flex flex-col items-center justify-start 
      bg-gradient-to-b bg-[linear-gradient(135deg,_#0f0f23_0%,_#1a1a2e_25%,_#16213e_50%,_#0f3460_75%,_#533483_100%)] text-gray-100 px-4 overflow-x-hidden"
    >
      <Particles
        particleColors={['#ffffff', '#ffffff']}
        particleCount={300}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={150}
        moveParticlesOnHover={true}
        alphaParticles={false}
        disableRotation={false}
      />

      <div className="absolute z-30 min-h-screen w-full  flex items-center flex-col py-10 px-4 ">
        <div
          className="w-full max-w-6xl flex  justify-between items-center bg-[#1e1b4b]/70 backdrop-blur-xl 
        border border-white/10 shadow-[0_0_25px_rgba(59,130,246,0.3)] rounded-2xl px-6 py-4"
        >
          <h1 className="text-2xl md:text-2xl font-semibold flex items-center gap-2 leading-none">
            <img
              src={logo}
              alt="GDG"
              className="w-24 h-24"
            />

            <h3 className="leading-[0.8]">
              <span className="bg-[linear-gradient(45deg,_rgba(66,133,244,0.8),_rgba(52,168,83,0.8))] bg-clip-text text-transparent">
                GDG Durgapur
              </span>
              <br />
              <span className="text-sm text-gray-300 ml-2 font-normal">Attendance System</span>
            </h3>
          </h1>

          <div className="flex items-center gap-3">
            <span className="text-sm bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">
              ● Ready
            </span>
            <span className="text-sm bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full font-semibold">
              DEVFEST 2025
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-10 w-full max-w-6xl mt-10">
          {/* QR Code Scanner */}
          <div
            className="flex-1 bg-[#1e293b]/70 backdrop-blur-lg border border-white/10 rounded-2xl 
          shadow-[0_0_30px_rgba(59,130,246,0.3)] p-6 hover:scale-[1.02] transition-transform duration-300"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                QR Code Scanner
              </span>
            </h2>

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

            <div className="mt-6 flex flex-col items-center gap-3">
              <button
                onClick={() => {
                  setUseZXingScanner(!useZXingScanner);
                  setShowScanner(false);
                  setMessage('');
                }}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
              rounded-xl text-white font-medium shadow-md transition-transform transform hover:scale-105"
              >
                Switch to {useZXingScanner ? 'React QR Reader' : 'ZXing Scanner'}
              </button>

              {!useZXingScanner && (
                <p className="text-xs sm:text-sm text-orange-400 text-center">
                  ⚠️ React QR Reader may have issues. ZXing Scanner is recommended.
                </p>
              )}
              {!zxingAvailable && (
                <p className="text-xs sm:text-sm text-red-400 text-center">
                  ❌ ZXing Scanner is not available in this browser.
                </p>
              )}
            </div>
          </div>

          {/* Manual Check-In */}
          <div
            className="flex-1 flex items-center opacity-100 fit-content text-gray-800 rounded-2xl p-5 shadow-[0_0_30px_rgba(255,255,255,0.2)] 
          hover:scale-[1.02] transition-transform duration-300"
          >
            <ManualCheckIn
              manualID={manualID}
              setManualID={setManualID}
              handleManualCheckIn={handleManualCheckIn}
            />
          </div>
        </div>

        {/* Message Box */}
        {message && (
          <div className="w-full max-w-lg mt-10">
            <MessageBox message={message} onClear={clearMessage} />
          </div>
        )}
      </div>

      {/* Header */}
    </div>
  );
}
