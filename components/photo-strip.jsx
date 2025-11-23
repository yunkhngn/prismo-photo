import { useState, useRef, useEffect } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";

export default function PhotoStrip({ photos, onExport }) {
  const canvasRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [stripPhotos, setStripPhotos] = useState(Array(8).fill(null));
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedFromStrip, setDraggedFromStrip] = useState(false);

  // Initialize stripPhotos with photos when component mounts or photos change
  useEffect(() => {
    const initial = Array(8).fill(null);
    photos.forEach((photo, index) => {
      if (index < 8) {
        initial[index] = photo;
      }
    });
    setStripPhotos(initial);
  }, [photos]);


  const generatePhotoStrip = () => {
    const validPhotos = stripPhotos.filter(photo => photo !== null);
    if (validPhotos.length === 0) {
      alert("Vui lòng kéo thả ít nhất 1 ảnh vào các khung!");
      return;
    }

    setIsGenerating(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Photo strip dimensions
    const stripWidth = 1200; // Total width
    const stripHeight = 3000; // Total height (4 rows)
    const photoWidth = 550; // Width of each photo
    const photoHeight = 700; // Height of each photo
    const padding = 25; // Padding between photos
    const backgroundColor = "#22C55E"; // Green background (green-500)

    canvas.width = stripWidth;
    canvas.height = stripHeight;

    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, stripWidth, stripHeight);

    // Draw 8 frames (2 columns x 4 rows)
    const positions = [
      { x: padding, y: padding }, // Row 1, Col 1
      { x: padding + photoWidth + padding, y: padding }, // Row 1, Col 2
      { x: padding, y: padding + photoHeight + padding }, // Row 2, Col 1
      { x: padding + photoWidth + padding, y: padding + photoHeight + padding }, // Row 2, Col 2
      { x: padding, y: padding + (photoHeight + padding) * 2 }, // Row 3, Col 1
      { x: padding + photoWidth + padding, y: padding + (photoHeight + padding) * 2 }, // Row 3, Col 2
      { x: padding, y: padding + (photoHeight + padding) * 3 }, // Row 4, Col 1
      { x: padding + photoWidth + padding, y: padding + (photoHeight + padding) * 3 }, // Row 4, Col 2
    ];

    // Load and draw photos
    const imagePromises = positions.map((pos, index) => {
      return new Promise((resolve) => {
        const photo = stripPhotos[index];
        if (!photo) {
          // Draw empty frame
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 8;
          ctx.strokeRect(pos.x - 4, pos.y - 4, photoWidth + 8, photoHeight + 8);
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(pos.x, pos.y, photoWidth, photoHeight);
          resolve();
          return;
        }

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          // Draw white frame border
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 8;
          ctx.strokeRect(pos.x - 4, pos.y - 4, photoWidth + 8, photoHeight + 8);

          // Draw photo
          ctx.drawImage(img, pos.x, pos.y, photoWidth, photoHeight);

          resolve();
        };
        img.onerror = () => {
          // Draw placeholder if image fails to load
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 8;
          ctx.strokeRect(pos.x - 4, pos.y - 4, photoWidth + 8, photoHeight + 8);
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(pos.x, pos.y, photoWidth, photoHeight);
          ctx.fillStyle = "#CCCCCC";
          ctx.font = "24px Arial";
          ctx.textAlign = "center";
          ctx.fillText("Error", pos.x + photoWidth / 2, pos.y + photoHeight / 2);
          resolve();
        };
        img.src = photo;
      });
    });

    Promise.all(imagePromises).then(() => {
      setIsGenerating(false);
      // Export the strip
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        onExport(url);
      }, "image/jpeg", 0.95);
    });
  };

  const downloadStrip = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.href = canvasRef.current.toDataURL("image/jpeg", 0.95);
    link.download = "prismo-photo-strip.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardBody className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Tạo Photo Strip</h3>
              <p className="text-sm text-gray-600">
                Từ {stripPhotos.filter(p => p !== null).length}/8 ảnh đã sắp xếp
              </p>
            </div>
            <Button
              color="primary"
              size="lg"
              onPress={generatePhotoStrip}
              isLoading={isGenerating}
              isDisabled={stripPhotos.filter(p => p !== null).length === 0}
            >
              {isGenerating ? "Đang tạo..." : "Tạo Photo Strip"}
            </Button>
          </div>

          <div className="mt-4 flex justify-center">
            <Button
              color="secondary"
              size="lg"
              variant="flat"
              onPress={downloadStrip}
              isDisabled={!canvasRef.current || isGenerating}
            >
              Tải xuống Photo Strip
            </Button>
          </div>
        </CardBody>
      </Card>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
