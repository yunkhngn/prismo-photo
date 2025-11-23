import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { useDisclosure } from "@heroui/use-disclosure";

export default function ExportButton({ photos }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isExporting, setIsExporting] = useState(false);

  const downloadImage = (imageUrl, filename) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    if (photos.length === 0) return;

    setIsExporting(true);
    photos.forEach((photo, index) => {
      setTimeout(() => {
        downloadImage(photo, `prismo-photo-${index + 1}.jpg`);
      }, index * 200);
    });

    setTimeout(() => {
      setIsExporting(false);
      onClose();
    }, photos.length * 200 + 500);
  };

  const downloadSingle = (photo, index) => {
    downloadImage(photo, `prismo-photo-${index + 1}.jpg`);
  };

  const downloadAsCollage = () => {
    if (photos.length === 0) return;

    setIsExporting(true);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const cols = 2;
    const rows = 2;
    const imgSize = 800;

    canvas.width = imgSize * cols;
    canvas.height = imgSize * rows;

    const promises = photos.map((photo, index) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          ctx.drawImage(
            img,
            col * imgSize,
            row * imgSize,
            imgSize,
            imgSize
          );
          resolve();
        };
        img.src = photo;
      });
    });

    Promise.all(promises).then(() => {
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        downloadImage(url, "prismo-photo-collage.jpg");
        setIsExporting(false);
        onClose();
      }, "image/jpeg", 0.9);
    });
  };

  if (photos.length === 0) {
    return (
      <Button color="primary" size="lg" isDisabled>
        Chưa có ảnh để xuất
      </Button>
    );
  }

  return (
    <>
      <Button color="primary" size="lg" onPress={onOpen}>
        📥 Xuất ảnh
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>Xuất ảnh</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  color="primary"
                  variant="flat"
                  onPress={downloadAll}
                  isLoading={isExporting}
                >
                  Tải tất cả ảnh
                </Button>
                <Button
                  color="secondary"
                  variant="flat"
                  onPress={downloadAsCollage}
                  isLoading={isExporting}
                >
                  Tải ảnh ghép (Collage)
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {photos.map((photo, index) => (
                  <Card key={index} className="relative">
                    <CardBody className="p-2">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        className="mt-2 w-full"
                        onPress={() => downloadSingle(photo, index)}
                      >
                        Tải ảnh {index + 1}
                      </Button>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

