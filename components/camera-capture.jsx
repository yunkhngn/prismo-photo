import { useState, useRef, useEffect } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";

export default function CameraCapture({ onCapture, onClose }) {
  const [stream, setStream] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      // 4:3 aspect ratio
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "user", 
          width: { ideal: 1280 },
          height: { ideal: 960 },
          aspectRatio: { ideal: 4/3 }
        },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Không thể truy cập camera. Vui lòng cho phép quyền truy cập camera.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Calculate 4:3 aspect ratio dimensions
    const videoAspectRatio = video.videoWidth / video.videoHeight;
    const targetAspectRatio = 4 / 3;
    
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = video.videoWidth;
    let sourceHeight = video.videoHeight;

    // Crop to 4:3 if video is not already 4:3
    if (videoAspectRatio > targetAspectRatio) {
      // Video is wider than 4:3, crop width
      sourceWidth = video.videoHeight * targetAspectRatio;
      sourceX = (video.videoWidth - sourceWidth) / 2;
    } else if (videoAspectRatio < targetAspectRatio) {
      // Video is taller than 4:3, crop height
      sourceHeight = video.videoWidth / targetAspectRatio;
      sourceY = (video.videoHeight - sourceHeight) / 2;
    }

    // Set canvas to 4:3 ratio (use 1280x960 for good quality)
    const outputWidth = 1280;
    const outputHeight = 960;
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // Flip image horizontally for mirror effect
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(
      video,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, outputWidth, outputHeight
    );

    // Reset transform
    context.setTransform(1, 0, 0, 1, 0, 0);

    canvas.toBlob((blob) => {
      const imageUrl = URL.createObjectURL(blob);
      onCapture(imageUrl);
      setIsCapturing(false);
    }, "image/jpeg", 0.9);
  };

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      capturePhoto();
    }, 100);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <Card className="w-full max-w-4xl mx-4">
        <CardBody className="p-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-lg bg-black"
              style={{ transform: "scaleX(-1)" }}
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="flex gap-4 justify-center mt-4">
            <Button
              color="danger"
              variant="flat"
              onPress={handleClose}
            >
              Đóng
            </Button>
            <Button
              color="primary"
              size="lg"
              onPress={handleCapture}
              isLoading={isCapturing}
            >
              {isCapturing ? "Đang chụp..." : "📸 Chụp ảnh"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

