import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Grid,
  Image,
  IconButton,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

export default function CameraCapture({ maxPhotos = 8, onComplete }) {
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Không thể truy cập camera. Vui lòng cho phép quyền truy cập camera.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (photos.length >= maxPhotos) {
      return;
    }

    setIsCapturing(true);
    let count = 3;
    setCountdown(count);

    const countdownInterval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(countdownInterval);
        takePhoto();
      }
    }, 1000);
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const photoData = canvas.toDataURL("image/jpeg");
    setPhotos((prev) => [...prev, photoData]);
    setCountdown(0);
    setIsCapturing(false);

    if (photos.length + 1 >= maxPhotos) {
      setTimeout(() => {
        onComplete([...photos, photoData]);
      }, 500);
    }
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    if (photos.length > 0) {
      stopCamera();
      onComplete(photos);
    }
  };

  return (
    <VStack spacing={6} w="100%">
      <Box
        position="relative"
        w="100%"
        maxW="800px"
        aspectRatio="4/3"
        bg="black"
        borderRadius="lg"
        overflow="hidden"
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scaleX(-1)",
          }}
        />
        {countdown > 0 && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            fontSize="8xl"
            fontWeight="bold"
            color="white"
            textShadow="0 0 20px rgba(0,0,0,0.8)"
            zIndex={10}
          >
            {countdown}
          </Box>
        )}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </Box>

      <VStack spacing={4} w="100%">
        <Text fontSize="lg" fontWeight="semibold">
          Đã chụp: {photos.length}/{maxPhotos}
        </Text>

        {photos.length > 0 && (
          <Grid
            templateColumns="repeat(4, 1fr)"
            gap={4}
            w="100%"
            maxW="600px"
          >
            {photos.map((photo, index) => (
              <Box key={index} position="relative">
                <Image
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  borderRadius="md"
                  border="2px solid"
                  borderColor="purple.300"
                />
                <IconButton
                  icon={<DeleteIcon />}
                  size="sm"
                  colorScheme="red"
                  position="absolute"
                  top={-2}
                  right={-2}
                  onClick={() => removePhoto(index)}
                  aria-label="Xóa ảnh"
                />
              </Box>
            ))}
          </Grid>
        )}

        <HStack spacing={4}>
          {photos.length < maxPhotos && (
            <Button
              colorScheme="purple"
              size="lg"
              onClick={capturePhoto}
              isDisabled={isCapturing}
            >
              {isCapturing ? `Chụp trong ${countdown}...` : "Chụp ảnh"}
            </Button>
          )}
          {photos.length > 0 && (
            <Button
              colorScheme="green"
              size="lg"
              onClick={handleComplete}
              isDisabled={photos.length < maxPhotos}
            >
              Hoàn thành ({photos.length}/{maxPhotos})
            </Button>
          )}
        </HStack>
      </VStack>
    </VStack>
  );
}

