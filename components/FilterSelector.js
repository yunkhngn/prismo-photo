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

const filters = [
  { id: "none", name: "Không filter" },
  { id: "vintage", name: "Vintage", css: "sepia(0.5) contrast(1.2)" },
  { id: "blackwhite", name: "Đen trắng", css: "grayscale(1)" },
  { id: "warm", name: "Ấm áp", css: "sepia(0.3) saturate(1.2) brightness(1.1)" },
  { id: "cool", name: "Mát mẻ", css: "hue-rotate(180deg) saturate(0.8)" },
  { id: "bright", name: "Sáng", css: "brightness(1.2) contrast(1.1)" },
  { id: "dramatic", name: "Kịch tính", css: "contrast(1.5) saturate(1.3)" },
];

export default function FilterSelector({ photos, frame, onSelect, onBack }) {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [processedPhotos, setProcessedPhotos] = useState([]);
  const toast = useToast();

  const applyFilter = (photo, filterId) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        if (filterId !== "none") {
          const filter = filters.find((f) => f.id === filterId);
          if (filter && filter.css) {
            ctx.filter = filter.css;
            ctx.drawImage(img, 0, 0);
          }
        }

        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.src = photo;
    });
  };

  const handleSelect = async (filter) => {
    setSelectedFilter(filter.id);
    toast({
      title: "Đang áp dụng filter...",
      status: "info",
      duration: 1000,
    });

    // Apply filter to all photos (use frame-processed photos if available)
    const sourcePhotos = frame?.processedPhotos || photos;
    const filteredPhotos = await Promise.all(
      sourcePhotos.map((photo) => applyFilter(photo, filter.id))
    );

    setProcessedPhotos(filteredPhotos);
    onSelect({ ...filter, processedPhotos: filteredPhotos });
  };

  const previewPhoto = processedPhotos[0] || photos[0];

  return (
    <VStack spacing={6} w="100%">
      <Text fontSize="2xl" fontWeight="bold">
        Chọn Filter cho ảnh
      </Text>

      <HStack spacing={6} w="100%" maxW="1000px">
        <Box flex={1}>
          <Text mb={4} fontWeight="semibold">
            Preview:
          </Text>
          <Box
            borderRadius="lg"
            overflow="hidden"
            border="2px solid"
            borderColor="purple.200"
            aspectRatio="4/3"
            bg="gray.100"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {previewPhoto && (
              <Image
                src={previewPhoto}
                alt="Preview"
                w="100%"
                h="100%"
                objectFit="contain"
                filter={
                  selectedFilter
                    ? filters.find((f) => f.id === selectedFilter)?.css
                    : "none"
                }
              />
            )}
          </Box>
        </Box>

        <Box flex={1}>
          <Grid templateColumns="repeat(2, 1fr)" gap={4} w="100%">
            {filters.map((filter) => (
              <Box
                key={filter.id}
                p={3}
                borderRadius="md"
                border="2px solid"
                borderColor={
                  selectedFilter === filter.id ? "purple.500" : "gray.200"
                }
                cursor="pointer"
                _hover={{ borderColor: "purple.300" }}
                transition="all 0.2s"
                onClick={() => handleSelect(filter)}
                bg={selectedFilter === filter.id ? "purple.50" : "white"}
              >
                <Text textAlign="center" fontWeight="semibold" fontSize="sm">
                  {filter.name}
                </Text>
              </Box>
            ))}
          </Grid>
        </Box>
      </HStack>

      <HStack spacing={4}>
        <Button onClick={onBack} variant="outline">
          Quay lại
        </Button>
        {selectedFilter && (
          <Button
            colorScheme="purple"
            onClick={() =>
              handleSelect(filters.find((f) => f.id === selectedFilter))
            }
          >
            Tiếp tục - Gửi Email
          </Button>
        )}
      </HStack>
    </VStack>
  );
}

