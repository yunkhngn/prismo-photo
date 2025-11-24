import { useState, useRef } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";

export default function PhotoStrip({ stripPhotos = [], onExport }) {
  const canvasRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);


  const generatePhotoStrip = () => {
    const validPhotos = stripPhotos.filter((photo) => photo !== null);
    if (validPhotos.length === 0) {
      alert("Vui lòng kéo thả ít nhất 1 ảnh vào các khung!");
      return;
    }

    setIsGenerating(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Frame SVG dimensions (A4 portrait: 595.28 x 841.89)
    // Using actual pixel dimensions for high quality output
    const svgViewBox = { width: 595.28, height: 841.89 };
    const outputWidth = 1200; // High quality output width
    const outputHeight = Math.round(
      (outputWidth / svgViewBox.width) * svgViewBox.height
    ); // ~1697px

    // Photo frame positions in SVG coordinates (from frame.svg)
    // Frame positions: x=199.46, width=196.36, height=163.23
    const frameX = 199.46;
    const frameWidth = 196.36;
    const frameHeight = 163.23;
    const frameYPositions = [37.66, 209.27, 380.91, 552.55]; // Y positions of 4 frames

    // Scale to output dimensions
    const scaleX = outputWidth / svgViewBox.width;
    const scaleY = outputHeight / svgViewBox.height;

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // Load and draw SVG template as background
    const svgImg = new Image();
    svgImg.onload = () => {
      // Draw SVG background
      ctx.drawImage(svgImg, 0, 0, outputWidth, outputHeight);

      // Draw photos into frames
      const imagePromises = frameYPositions.map((frameY, index) => {
        return new Promise((resolve) => {
          const photo = stripPhotos[index];
          if (!photo) {
            // Keep placeholder from SVG
            resolve();
            return;
          }

          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            // Calculate scaled positions
            const scaledX = frameX * scaleX;
            const scaledY = frameY * scaleY;
            const scaledWidth = frameWidth * scaleX;
            const scaledHeight = frameHeight * scaleY;

            // Draw photo to fill the frame (cover mode)
            const imgAspectRatio = img.width / img.height;
            const frameAspectRatio = scaledWidth / scaledHeight;

            let drawX = scaledX;
            let drawY = scaledY;
            let drawWidth = scaledWidth;
            let drawHeight = scaledHeight;

            if (imgAspectRatio > frameAspectRatio) {
              // Image is wider, fit to height and crop width
              drawHeight = scaledHeight;
              drawWidth = drawHeight * imgAspectRatio;
              drawX = scaledX - (drawWidth - scaledWidth) / 2;
            } else {
              // Image is taller, fit to width and crop height
              drawWidth = scaledWidth;
              drawHeight = drawWidth / imgAspectRatio;
              drawY = scaledY - (drawHeight - scaledHeight) / 2;
            }

            // Draw photo
            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

            resolve();
          };
          img.onerror = () => {
            // Keep placeholder if image fails to load
            resolve();
          };
          img.src = photo;
        });
      });

      Promise.all(imagePromises).then(() => {
        setIsGenerating(false);
        // Export the strip
        canvas.toBlob(
          (blob) => {
            const url = URL.createObjectURL(blob);
            onExport(url);
          },
          "image/jpeg",
          0.95
        );
      });
    };
    svgImg.onerror = () => {
      // Fallback: draw pink background if SVG fails to load
      ctx.fillStyle = "#f7a7b7";
      ctx.fillRect(0, 0, outputWidth, outputHeight);
      setIsGenerating(false);
      alert("Không thể tải frame template. Vui lòng thử lại.");
    };
    svgImg.src = "/frame/frame.svg";
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
                Từ {stripPhotos.filter((p) => p !== null).length}/4 ảnh đã sắp xếp
              </p>
            </div>
            <Button
              color="primary"
              size="lg"
              onPress={generatePhotoStrip}
              isLoading={isGenerating}
              isDisabled={stripPhotos.filter((p) => p !== null).length === 0}
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
