import { useState, useRef, useEffect } from "react";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import { Card, CardBody } from "@heroui/card";
import FilterSelector from "./filter-selector";
import FrameSelector from "./frame-selector";
import PhotoStrip from "./photo-strip";
import PhotoStripDrag from "./photo-strip-drag";
import ExportButton from "./export-button";

export default function PhotoBooth() {
  const [photos, setPhotos] = useState([]);
  const [stream, setStream] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [countdownActive, setCountdownActive] = useState(false);
  const [currentCountdown, setCurrentCountdown] = useState(3);
  const [layout, setLayout] = useState("1x4");
  const [videoRecap, setVideoRecap] = useState(false);
  const [showFrameSelector, setShowFrameSelector] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const [stripPhotos, setStripPhotos] = useState(Array(8).fill(null));
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      // 4:3 aspect ratio - common resolutions: 1280x960, 1600x1200, 1920x1440
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode, 
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

  const flipCamera = () => {
    setFacingMode(facingMode === "user" ? "environment" : "user");
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

    // Flip image horizontally for front camera
    if (facingMode === "user") {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(
        video,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, outputWidth, outputHeight
      );
      context.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      context.drawImage(
        video,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, outputWidth, outputHeight
      );
    }

    canvas.toBlob((blob) => {
      const imageUrl = URL.createObjectURL(blob);
      const newPhotos = [...photos];
      const nextIndex = photos.length;
      if (nextIndex < 4) {
        newPhotos[nextIndex] = imageUrl;
        setPhotos(newPhotos);
      }
      setIsCapturing(false);
    }, "image/jpeg", 0.9);
  };

  const handleCapture = (auto = false) => {
    if (photos.length >= 4) {
      alert("Bạn đã chụp đủ 4 ảnh!");
      return;
    }

    if (auto && countdown > 0) {
      setCountdownActive(true);
      setCurrentCountdown(countdown);
      
      const updateCountdown = () => {
        setCurrentCountdown((prev) => {
          if (prev > 1) {
            setTimeout(updateCountdown, 1000);
            return prev - 1;
          } else {
            setCountdownActive(false);
            setIsCapturing(true);
            setTimeout(() => {
              capturePhoto();
            }, 100);
            return 0;
          }
        });
      };
      
      setTimeout(updateCountdown, 1000);
    } else {
      setIsCapturing(true);
      setTimeout(() => {
        capturePhoto();
      }, 100);
    }
  };

  const handleRetake = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  const handleDelete = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  const handleUpload = (index, file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhotos = [...photos];
        newPhotos[index] = e.target.result;
        setPhotos(newPhotos);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-green-500 mb-2">Prism Photo </h1>
          <p className="text-xl text-green-400">Capture Memories</p>
        </div>

        {/* Settings Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Layout Ảnh:</span>
            <Select
              selectedKeys={[layout]}
              onSelectionChange={(keys) => setLayout(Array.from(keys)[0])}
              className="w-24"
              size="sm"
            >
              <SelectItem key="1x4" value="1x4">1x4</SelectItem>
              <SelectItem key="2x2" value="2x2">2x2</SelectItem>
              <SelectItem key="4x1" value="4x1">4x1</SelectItem>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Đếm Ngược:</span>
            <Select
              selectedKeys={[countdown.toString()]}
              onSelectionChange={(keys) => setCountdown(parseInt(Array.from(keys)[0]))}
              className="w-20"
              size="sm"
            >
              <SelectItem key="0" value="0">0s</SelectItem>
              <SelectItem key="3" value="3">3s</SelectItem>
              <SelectItem key="5" value="5">5s</SelectItem>
              <SelectItem key="10" value="10">10s</SelectItem>
            </Select>
          </div>

          <Button
            color="primary"
            variant="flat"
            size="sm"
            onPress={() => setShowFrameSelector(!showFrameSelector)}
            className="bg-green-500 text-white"
          >
            Chọn Khung
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
          {/* Camera Preview - Left Side */}
          <div className="lg:col-span-5">
            <Card className="relative">
              <CardBody className="p-0">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{
                      transform: facingMode === "user" ? "scaleX(-1)" : "none",
                      minHeight: "500px",
                      aspectRatio: "4/3",
                    }}
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Flip Camera Button */}
                  <Button
                    isIconOnly
                    variant="flat"
                    className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm"
                    onPress={flipCamera}
                    size="sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h18m-4.5 0L21 12m0 0l-4.5-4.5M21 12H3"
                      />
                    </svg>
                  </Button>

                  {/* Countdown Display */}
                  {countdownActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
                      <div className="text-9xl font-bold text-white animate-pulse">
                        {currentCountdown}
                      </div>
                    </div>
                  )}

                  {/* Status Indicator */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-green-500 text-white px-6 py-2 rounded-full text-sm font-medium">
                      Đã Chụp {photos.length}/4
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Photo Slots - Middle */}
          <div className="lg:col-span-3 space-y-3">
            {/* 4 Photo Slots */}
            {Array.from({ length: 4 }).map((_, index) => {
              const photo = photos[index];
              return (
                <Card key={index} className="relative">
                  <CardBody className="p-3">
                    {photo ? (
                      <div className="relative group">
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.effectAllowed = "move";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            onPress={() => handleDelete(index)}
                          >
                            Xóa
                          </Button>
                          <Button
                            size="sm"
                            color="primary"
                            variant="flat"
                            onPress={() => handleRetake(index)}
                          >
                            Chụp lại
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50">
                          <svg
                            className="w-12 h-12 text-gray-400 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id={`upload-${index}`}
                            onChange={(e) => handleUpload(index, e.target.files[0])}
                          />
                          <Button
                            size="sm"
                            color="primary"
                            variant="bordered"
                            onPress={() => document.getElementById(`upload-${index}`).click()}
                          >
                            Upload
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              );
            })}
            <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium text-center">
              {photos.length}/4
            </div>

          </div>

          {/* Photo Strip Drag - Right Side (Frame) */}
          <div className="lg:col-span-4">
            <PhotoStripDrag
              photos={photos}
              onStripPhotosChange={setStripPhotos}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="flex flex-col items-center gap-2">
            <Button
              isIconOnly
              color="primary"
              size="lg"
              radius="full"
              className="bg-green-500 text-white w-16 h-16"
              onPress={() => handleCapture(false)}
              isDisabled={isCapturing || photos.length >= 4}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-8.426c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                />
              </svg>
            </Button>
            <span className="text-sm text-gray-700">Chụp tay</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Button
              isIconOnly
              color="primary"
              size="lg"
              radius="full"
              className="bg-green-500 text-white w-16 h-16"
              onPress={() => handleCapture(true)}
              isDisabled={isCapturing || photos.length >= 4}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-8.426c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                />
              </svg>
            </Button>
            <span className="text-sm text-gray-700">AUTO</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Button
              isIconOnly
              color="success"
              size="lg"
              radius="full"
              className="bg-green-500 text-white w-16 h-16"
              onPress={() => setPhotos([])}
              isDisabled={photos.length === 0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </Button>
            <span className="text-sm text-gray-700">Chụp Lại</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Switch
              isSelected={videoRecap}
              onValueChange={setVideoRecap}
              color="primary"
            />
            <span className="text-sm text-gray-700">Video Recap</span>
          </div>
        </div>

        {/* Photo Strip Generator */}
        {showFrameSelector && (
          <div className="mb-6">
            <Card>
              <CardBody>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Tạo Photo Strip</h3>
                  <Button
                    size="sm"
                    variant="light"
                    onPress={() => setShowFrameSelector(false)}
                  >
                    Đóng
                  </Button>
                </div>
                <PhotoStrip
                  photos={photos}
                  stripPhotos={stripPhotos}
                  onExport={(url) => {
                    // Auto download when generated
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "prismo-photo-strip.jpg";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  }}
                />
              </CardBody>
            </Card>
          </div>
        )}

        {/* Export Button */}
        {photos.length > 0 && (
          <div className="flex justify-center">
            <ExportButton photos={photos} />
          </div>
        )}
      </div>
    </div>
  );
}

