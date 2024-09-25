import { Button } from "@mui/material";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props) => {
  let config = { qrbox: { width: 175, height: 175 } };

  if (props.fps) {
    config.fps = props.fps;
  }
  if (props.qrbox) {
    config.qrbox = props.qrbox;
  }
  if (props.aspectRatio) {
    config.aspectRatio = props.aspectRatio;
  }
  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip;
  }

  // Use the back camera by default
  config.videoConstraints = {
    facingMode: "environment", // 'environment' is for the back camera
  };

  return config;
};

const Html5QrcodePlugin = (props) => {
  const qrCodeTimeoutRef = useRef(null); // To track the debounce timer
  const focusedQRCodeRef = useRef(""); // Track the current QR code in focus
  const html5QrcodeScannerRef = useRef(null); // Store scanner instance
  const [isPaused, setIsPaused] = useState(null);

  const debounceTime = 3000; // 3 seconds focus time before scanning

  useEffect(() => {
    // when component mounts
    const config = createConfig(props);
    const verbose = props.verbose === true;

    // Success callback is required.
    if (!props.qrCodeSuccessCallback) {
      throw "qrCodeSuccessCallback is required callback.";
    }

    // Initialize the Html5QrcodeScanner only if not already initialized
    if (!html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current = new Html5QrcodeScanner(
        qrcodeRegionId,
        config,
        verbose
      );

      // Wrapper for the success callback to implement a debounce mechanism
      const onSuccess = (decodedText, decodedResult) => {
        if (focusedQRCodeRef.current === decodedText) {
          // If the same QR code is focused, start the debounce timer
          if (!qrCodeTimeoutRef.current) {
            qrCodeTimeoutRef.current = setTimeout(() => {
              props.qrCodeSuccessCallback(decodedText, decodedResult);
              html5QrcodeScannerRef.current.pause(); // Pause the scanner after successful scan
              setIsPaused(true);
              clearTimeout(qrCodeTimeoutRef.current); // Clear timeout
              qrCodeTimeoutRef.current = null; // Reset timer
            }, debounceTime);
          }
        } else {
          // Reset the focus and debounce timer if a new QR code is detected
          focusedQRCodeRef.current = decodedText;
          clearTimeout(qrCodeTimeoutRef.current);
          qrCodeTimeoutRef.current = null;
        }
      };

      html5QrcodeScannerRef.current.render(
        onSuccess,
        props.qrCodeErrorCallback
      );
    }

    // Cleanup function when component will unmount
    return () => {
      clearTimeout(qrCodeTimeoutRef.current); // Clear any remaining timeout
    };
  }, [props]);

  return (
    <>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <div id={qrcodeRegionId} style={{ width: "100%", height: "100%" }} />
        <button
          onClick={() => {
            if (isPaused !== null) {
              if (isPaused) {
                html5QrcodeScannerRef.current.resume();
              } else if (isPaused === false) {
                html5QrcodeScannerRef.current.pause();
              }
            }
            setIsPaused(isPaused === null ? false : isPaused ? false : true);
          }}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 1000,
            padding: "5px",
            fontSize: "10px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
      </div>
      {/* <div
        id={qrcodeRegionId}
        style={{ width: "300px", height: "300px" }}
        onClick={() => {
          if (isPaused !== null) {
            if (isPaused) {
              html5QrcodeScannerRef.current.resume();
            } else if (isPaused === false) {
              html5QrcodeScannerRef.current.pause();
            }
          }
          setIsPaused(isPaused === null ? false : isPaused ? false : true);
        }}
      /> */}
    </>
  );
};

export default Html5QrcodePlugin;
