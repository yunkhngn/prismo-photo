import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import CameraCapture from "@/components/CameraCapture";
import PhotoGallery from "@/components/PhotoGallery";
import FrameSelector from "@/components/FrameSelector";
import FilterSelector from "@/components/FilterSelector";
import EmailForm from "@/components/EmailForm";

export default function Home() {
  const [photos, setPhotos] = useState([]);
  const [currentStep, setCurrentStep] = useState("camera"); // camera, gallery, frame, filter, email
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [processedPhotos, setProcessedPhotos] = useState([]);
  const toast = useToast();

  const handlePhotosCaptured = (capturedPhotos) => {
    setPhotos(capturedPhotos);
    setCurrentStep("gallery");
    toast({
      title: "Chụp ảnh thành công!",
      description: `Đã chụp được ${capturedPhotos.length} ảnh`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleContinueToFrame = () => {
    setCurrentStep("frame");
  };

  const handleFrameSelected = (frame) => {
    setSelectedFrame(frame);
    setCurrentStep("filter");
  };

  const handleFilterSelected = (filter) => {
    setSelectedFilter(filter);
    setCurrentStep("email");
  };

  const handleBack = () => {
    if (currentStep === "gallery") setCurrentStep("camera");
    if (currentStep === "frame") setCurrentStep("gallery");
    if (currentStep === "filter") setCurrentStep("frame");
    if (currentStep === "email") setCurrentStep("filter");
  };

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="6xl">
        <VStack spacing={8}>
          <Heading
            size="2xl"
            bgGradient="linear(to-r, purple.400, pink.400)"
            bgClip="text"
          >
            Prism Photo
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Photobooth Online - Chụp 8 ảnh và tạo kỷ niệm đẹp
          </Text>

          {currentStep === "camera" && (
            <CameraCapture
              maxPhotos={8}
              onComplete={handlePhotosCaptured}
            />
          )}

          {currentStep === "gallery" && (
            <PhotoGallery
              photos={photos}
              onContinue={handleContinueToFrame}
              onBack={handleBack}
            />
          )}

          {currentStep === "frame" && (
            <FrameSelector
              photos={photos}
              onSelect={handleFrameSelected}
              onBack={handleBack}
            />
          )}

          {currentStep === "filter" && (
            <FilterSelector
              photos={photos}
              frame={selectedFrame}
              onSelect={handleFilterSelected}
              onBack={handleBack}
            />
          )}

          {currentStep === "email" && (
            <EmailForm
              photos={photos}
              frame={selectedFrame}
              filter={selectedFilter}
              onBack={handleBack}
            />
          )}
        </VStack>
      </Container>
    </Box>
  );
}
