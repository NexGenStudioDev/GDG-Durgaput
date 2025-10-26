import { useState } from 'react';
import Header from './Components/Header';
import QRCodeScanner from './Components/QRCodeScanner';
import ManualCheckIn from './Components/ManualCheckIn';
import MessageBox from './Components/MessageBox';

export default function GDGAttendance() {
  const [data, setData] = useState('');
  const [manualID, setManualID] = useState('');
  const [showScanner, setShowScanner] = useState(true);
  const [message, setMessage] = useState('');

  const handleScan = result => {
    if (result?.text) {
      setData(result.text);
      setMessage(`✅ Successfully Checked In: ${result.text}`);
      setShowScanner(false);
    }
  };

  const handleError = err => console.error(err);

  const handleManualCheckIn = () => {
    if (manualID.trim() === '') {
      setMessage('⚠️ Please enter a valid User ID.');
    } else {
      setMessage(`✅ Successfully Checked In: ${manualID}`);
      setManualID('');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col  bg-gradient-to-br from-blue-500 to-green-400 p-6 text-gray-800">
      <Header />
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
        <QRCodeScanner
          showScanner={showScanner}
          setShowScanner={setShowScanner}
          handleScan={handleScan}
          handleError={handleError}
        />
        <ManualCheckIn
          manualID={manualID}
          setManualID={setManualID}
          handleManualCheckIn={handleManualCheckIn}
        />
      </div>
      {message && <MessageBox message={message} />}
    </div>
  );
}
