import { QrReader } from 'react-qr-reader';
function QRCodeScanner({ showScanner, setShowScanner, handleScan, handleError }) {
    console.log('QRCodeScanner rendered with showScanner:', showScanner);
    console.log('QRCodeScanner rendered with handleScan:', handleScan);
    console.log('QRCodeScanner rendered with handleError:', handleError);
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
        Scan your QR code for instant check-in
      </p>
      {showScanner ? (
        <div className="w-64 h-64 border-4 border-blue-400 rounded-xl overflow-hidden mb-4">
          <QrReader
            onResult={handleScan}
            onError={handleError}
            style={{ width: '100%' }}
          />
        </div>
      ) : (
        <div className="w-64 h-64 border-2 border-dashed border-blue-300 rounded-xl flex items-center justify-center text-gray-400 mb-4">
          Position QR code within the frame
        </div>
      )}
      <button
        onClick={() => setShowScanner(!showScanner)}
        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-300"
      >
        {showScanner ? 'Stop Scanner' : 'Start Scanner'}
      </button>
    </div>
  );
}

export default QRCodeScanner;
