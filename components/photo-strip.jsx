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

  const handleDragStart = (e, photoIndex, fromStrip = false) => {
    setDraggedIndex(photoIndex);
    setDraggedFromStrip(fromStrip);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    
    if (draggedFromStrip) {
      // Moving within strip
      const newStripPhotos = [...stripPhotos];
      const draggedPhoto = stripPhotos[draggedIndex];
      newStripPhotos[draggedIndex] = stripPhotos[targetIndex];
      newStripPhotos[targetIndex] = draggedPhoto;
      setStripPhotos(newStripPhotos);
    } else {
      // Dropping from photo gallery
      if (draggedIndex !== null && draggedIndex < photos.length) {
        const newStripPhotos = [...stripPhotos];
        newStripPhotos[targetIndex] = photos[draggedIndex];
        setStripPhotos(newStripPhotos);
      }
    }
    
    setDraggedIndex(null);
    setDraggedFromStrip(false);
  };

  const handleRemoveFromStrip = (index) => {
    const newStripPhotos = [...stripPhotos];
    newStripPhotos[index] = null;
    setStripPhotos(newStripPhotos);
  };

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
    const backgroundColor = "#FF69B4"; // Pink background

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Photo Gallery */}
        <div className="lg:col-span-1">
          <Card>
            <CardBody className="p-4">
              <h4 className="text-lg font-semibold mb-3">Ảnh đã chụp</h4>
              <div className="space-y-2">
                {photos.length > 0 ? (
                  photos.map((photo, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index, false)}
                      className="cursor-move border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-pink-500 transition-colors"
                    >
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <p className="text-xs text-center mt-1 text-gray-600">Ảnh {index + 1}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Chưa có ảnh. Hãy chụp ảnh trước.
                  </p>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right: Photo Strip Frames */}
        <div className="lg:col-span-2">
          <Card>
            <CardBody className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Photo Strip (8 khung)</h3>
                  <p className="text-sm text-gray-600">
                    Kéo thả ảnh vào các khung bên dưới
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

              {/* 8 Frames Grid */}
              <div className="bg-pink-100 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-3">
                  {stripPhotos.map((photo, index) => (
                    <div
                      key={index}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`relative aspect-[550/700] border-2 border-dashed rounded-lg overflow-hidden transition-all ${
                        photo
                          ? "border-pink-500 bg-white"
                          : "border-gray-300 bg-gray-50 hover:border-pink-400"
                      }`}
                    >
                      {photo ? (
                        <>
                          <img
                            src={photo}
                            alt={`Frame ${index + 1}`}
                            className="w-full h-full object-cover"
                            draggable
                            onDragStart={(e) => handleDragStart(e, index, true)}
                          />
                          <div className="absolute top-1 right-1">
                            <Button
                              isIconOnly
                              size="sm"
                              color="danger"
                              variant="flat"
                              className="bg-white/90 backdrop-blur-sm"
                              onPress={() => handleRemoveFromStrip(index)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </Button>
                          </div>
                          <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                          <svg
                            className="w-12 h-12 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-xs">Khung {index + 1}</p>
                          <p className="text-xs mt-1">Kéo ảnh vào đây</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
