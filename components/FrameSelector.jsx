import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";

const FRAMES = [
  { id: "none", name: "Không frame", padding: 0 },
  { id: "simple", name: "Đơn giản", padding: 20, color: "#ffffff" },
  { id: "elegant", name: "Thanh lịch", padding: 30, color: "#f5f5f5", border: 3 },
  { id: "bold", name: "Nổi bật", padding: 25, color: "#000000", border: 5 },
  { id: "gold", name: "Vàng", padding: 30, color: "#FFD700", border: 4 },
  { id: "wood", name: "Gỗ", padding: 35, color: "#8B4513", border: 6 },
];

export default function FrameSelector({ selectedFrame, onFrameChange, photos }) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const applyFrameToImage = (imageUrl, frame) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const padding = frame.padding || 0;
        const borderWidth = frame.border || 0;
        const frameColor = frame.color || "#ffffff";

        canvas.width = img.width + padding * 2 + borderWidth * 2;
        canvas.height = img.height + padding * 2 + borderWidth * 2;

        // Draw frame background
        ctx.fillStyle = frameColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw border if exists
        if (borderWidth > 0) {
          ctx.strokeStyle = "#333333";
          ctx.lineWidth = borderWidth;
          ctx.strokeRect(
            borderWidth / 2,
            borderWidth / 2,
            canvas.width - borderWidth,
            canvas.height - borderWidth
          );
        }

        // Draw image
        ctx.drawImage(
          img,
          padding + borderWidth,
          padding + borderWidth,
          img.width,
          img.height
        );

        canvas.toBlob((blob) => {
          const framedUrl = URL.createObjectURL(blob);
          resolve(framedUrl);
        }, "image/jpeg", 0.9);
      };
      img.src = imageUrl;
    });
  };

  const handleFrameSelect = async (frameId) => {
    const frame = FRAMES.find((f) => f.id === frameId);
    if (!frame || !photos[selectedPhotoIndex]) return;

    if (frameId === "none") {
      onFrameChange(selectedPhotoIndex, photos[selectedPhotoIndex]);
      return;
    }

    const framedUrl = await applyFrameToImage(photos[selectedPhotoIndex], frame);
    onFrameChange(selectedPhotoIndex, framedUrl);
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Vui lòng chụp ảnh trước khi chọn frame</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {photos.map((photo, index) => (
          <Button
            key={index}
            size="sm"
            variant={selectedPhotoIndex === index ? "solid" : "bordered"}
            color={selectedPhotoIndex === index ? "primary" : "default"}
            onPress={() => setSelectedPhotoIndex(index)}
          >
            Ảnh {index + 1}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {FRAMES.map((frame) => (
          <Card
            key={frame.id}
            isPressable
            onPress={() => handleFrameSelect(frame.id)}
            className={`cursor-pointer ${
              selectedFrame === frame.id ? "ring-2 ring-primary" : ""
            }`}
          >
            <CardBody className="p-3">
              <div
                className="relative aspect-square rounded overflow-hidden"
                style={{
                  backgroundColor: frame.color || "#ffffff",
                  padding: `${frame.padding || 0}px`,
                  border: frame.border
                    ? `${frame.border}px solid #333333`
                    : "none",
                }}
              >
                {photos[selectedPhotoIndex] && (
                  <img
                    src={photos[selectedPhotoIndex]}
                    alt={frame.name}
                    className="w-full h-full object-cover rounded"
                  />
                )}
              </div>
              <p className="text-sm text-center mt-2 font-medium">{frame.name}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

