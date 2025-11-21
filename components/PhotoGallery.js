import { useState } from "react";
import {
  Box,
  Button,
  HStack,
  Grid,
  Image,
  VStack,
  Text,
} from "@chakra-ui/react";

export default function PhotoGallery({ photos, onContinue, onBack }) {
  return (
    <VStack spacing={6} w="100%">
      <Text fontSize="2xl" fontWeight="bold">
        Xem lại ảnh đã chụp
      </Text>

      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
        gap={4}
        w="100%"
        maxW="800px"
      >
        {photos.map((photo, index) => (
          <Box
            key={index}
            borderRadius="lg"
            overflow="hidden"
            border="2px solid"
            borderColor="purple.200"
            _hover={{ borderColor: "purple.400", transform: "scale(1.05)" }}
            transition="all 0.2s"
          >
            <Image src={photo} alt={`Photo ${index + 1}`} w="100%" h="auto" />
          </Box>
        ))}
      </Grid>

      <HStack spacing={4}>
        <Button onClick={onBack} variant="outline">
          Chụp lại
        </Button>
        <Button colorScheme="purple" onClick={onContinue}>
          Tiếp tục - Chọn Frame
        </Button>
      </HStack>
    </VStack>
  );
}

