// Browser compatibility check
export const checkBrowserCompatibility = () => {
  const issues = [];
  
  // Check for required APIs
  if (!navigator.mediaDevices) {
    issues.push('Camera API not supported');
  }
  
  if (!navigator.mediaDevices?.getUserMedia) {
    issues.push('getUserMedia not supported');
  }
  
  // Check for HTTPS (required for camera access in production)
  if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    issues.push('HTTPS required for camera access');
  }
  
  // Check for modern browser features
  if (!window.Promise) {
    issues.push('Promises not supported');
  }
  
  if (!window.fetch) {
    issues.push('Fetch API not supported');
  }
  
  return {
    isCompatible: issues.length === 0,
    issues
  };
};

// Camera capability check
export const checkCameraCapabilities = async () => {
  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      return { hasCamera: false, error: 'Camera API not supported' };
    }
    
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    
    return {
      hasCamera: videoDevices.length > 0,
      deviceCount: videoDevices.length,
      devices: videoDevices
    };
  } catch (error) {
    return { hasCamera: false, error: error.message };
  }
};
