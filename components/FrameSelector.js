import { useState } from "react";
import {
  Box,
  Button,
  HStack,
  Grid,
  Image,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";

const frames = [
  { id: "none", name: "Không frame", preview: null },
  { id: "classic", name: "Classic", preview: "classic" },
  { id: "vintage", name: "Vintage", preview: "vintage" },
  { id: "modern", name: "Modern", preview: "modern" },
  { id: "elegant", name: "Elegant", preview: "elegant" },
  { id: "fun", name: "Fun", preview: "fun" },
];

export default function FrameSelector({ photos, onSelect, onBack }) {
  const [selectedFrame, setSelectedFrame] = useState(null);
  const toast = useToast();

  const applyFrame = (photo, frameId) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const padding = frameId === "none" ? 0 : 40;

        canvas.width = img.width + padding * 2;
        canvas.height = img.height + padding * 2;

        // Draw frame background
        if (frameId !== "none") {
          ctx.fillStyle = getFrameColor(frameId);
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Draw photo
        ctx.drawImage(img, padding, padding, img.width, img.height);

        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.src = photo;
    });
  };

  const getFrameColor = (frameId) => {
    const colors = {
      classic: "#8B4513",
      vintage: "#D4A574",
      modern: "#2C3E50",
      elegant: "#F5F5DC",
      fun: "#FF6B9D",
    };
    return colors[frameId] || "#FFFFFF";
  };

  const handleSelect = async (frame) => {
    setSelectedFrame(frame.id);
    toast({
      title: "Đang áp dụng frame...",
      status: "info",
      duration: 1000,
    });

    // Apply frame to all photos
    const processedPhotos = await Promise.all(
      photos.map((photo) => applyFrame(photo, frame.id))
    );

    onSelect({ ...frame, processedPhotos });
  };

  return (
    <VStack spacing={6} w="100%">
      <Text fontSize="2xl" fontWeight="bold">
        Chọn Frame cho ảnh
      </Text>

      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
        gap={6}
        w="100%"
        maxW="900px"
      >
        {frames.map((frame) => (
          <Box
            key={frame.id}
            p={4}
            borderRadius="lg"
            border="2px solid"
            borderColor={
              selectedFrame === frame.id ? "purple.500" : "gray.200"
            }
            cursor="pointer"
            _hover={{ borderColor: "purple.300", transform: "scale(1.02)" }}
            transition="all 0.2s"
            onClick={() => handleSelect(frame)}
            bg={selectedFrame === frame.id ? "purple.50" : "white"}
          >
            <VStack spacing={2}>
              <Box
                w="100%"
                aspectRatio="4/3"
                bg="gray.100"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="2px solid"
                borderColor={
                  frame.id === "none"
                    ? "transparent"
                    : getFrameColor(frame.preview || frame.id)
                }
                p={frame.id === "none" ? 0 : 2}
              >
                {photos[0] && (
                  <Image
                    src={photos[0]}
                    alt="Preview"
                    maxH="100px"
                    borderRadius="sm"
                  />
                )}
              </Box>
              <Text fontWeight="semibold">{frame.name}</Text>
            </VStack>
          </Box>
        ))}
      </Grid>

      <HStack spacing={4}>
        <Button onClick={onBack} variant="outline">
          Quay lại
        </Button>
        {selectedFrame && (
          <Button colorScheme="purple" onClick={() => handleSelect(frames.find(f => f.id === selectedFrame))}>
            Tiếp tục - Chọn Filter
          </Button>
        )}
      </HStack>
    </VStack>
  );
}

