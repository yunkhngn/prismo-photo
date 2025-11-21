import { useState } from "react";
import {
  Box,
  Button,
  HStack,
  VStack,
  Text,
  Input,
  useToast,
  Grid,
  Image,
  Spinner,
} from "@chakra-ui/react";

export default function EmailForm({ photos, frame, filter, onBack }) {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const toast = useToast();

  const finalPhotos = filter?.processedPhotos || frame?.processedPhotos || photos;

  const handleSendEmail = async () => {
    if (!email || !email.includes("@")) {
      toast({
        title: "Email không hợp lệ",
        description: "Vui lòng nhập địa chỉ email hợp lệ",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          photos: finalPhotos,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Gửi email thành công!",
          description: "Ảnh đã được gửi đến email của bạn",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error(data.error || "Có lỗi xảy ra");
      }
    } catch (error) {
      toast({
        title: "Gửi email thất bại",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadAll = async () => {
    setIsDownloading(true);
    try {
      for (let i = 0; i < finalPhotos.length; i++) {
        const link = document.createElement("a");
        link.href = finalPhotos[i];
        link.download = `prism-photo-${i + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Small delay between downloads
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      toast({
        title: "Tải ảnh thành công!",
        description: `Đã tải ${finalPhotos.length} ảnh về máy`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Tải ảnh thất bại",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadSingle = (photo, index) => {
    const link = document.createElement("a");
    link.href = photo;
    link.download = `prism-photo-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <VStack spacing={6} w="100%">
      <Text fontSize="2xl" fontWeight="bold">
        Xem lại và tải ảnh
      </Text>

      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
        gap={4}
        w="100%"
        maxW="800px"
      >
        {finalPhotos.map((photo, index) => (
          <Box key={index} position="relative" borderRadius="lg" overflow="hidden">
            <Image src={photo} alt={`Photo ${index + 1}`} w="100%" />
            <Button
              size="sm"
              colorScheme="blue"
              position="absolute"
              bottom={2}
              left="50%"
              transform="translateX(-50%)"
              onClick={() => handleDownloadSingle(photo, index)}
            >
              Tải
            </Button>
          </Box>
        ))}
      </Grid>

      <VStack spacing={4} w="100%" maxW="500px">
        <Box w="100%">
          <Text mb={2} fontWeight="semibold">
            Nhập email để nhận ảnh:
          </Text>
          <Input
            type="email"
            placeholder="your-email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="lg"
          />
        </Box>

        <HStack spacing={4} w="100%">
          <Button
            onClick={handleDownloadAll}
            colorScheme="green"
            flex={1}
            isDisabled={isDownloading || isSending}
          >
            {isDownloading ? <Spinner size="sm" /> : "Tải tất cả ảnh"}
          </Button>
          <Button
            onClick={handleSendEmail}
            colorScheme="purple"
            flex={1}
            isDisabled={isSending || isDownloading || !email}
          >
            {isSending ? <Spinner size="sm" /> : "Gửi qua email"}
          </Button>
        </HStack>

        <Button onClick={onBack} variant="outline" w="100%">
          Quay lại
        </Button>
      </VStack>
    </VStack>
  );
}

