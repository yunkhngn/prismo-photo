import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";

export default function PhotoStripDrag({ photos, onStripPhotosChange }) {
  const [stripPhotos, setStripPhotos] = useState(Array(4).fill(null));

  // Initialize stripPhotos with photos when component mounts or photos change
  useEffect(() => {
    const initial = Array(4).fill(null);
    photos.forEach((photo, index) => {
      if (index < 4) {
        initial[index] = photo;
      }
    });
    setStripPhotos(initial);
    onStripPhotosChange(initial);
  }, [photos]);

  const handleDragStart = (e, photoIndex, fromStrip = false) => {
    e.dataTransfer.effectAllowed = "move";
    if (fromStrip) {
      e.dataTransfer.setData("text/plain", `strip-${photoIndex}`);
    } else {
      e.dataTransfer.setData("text/plain", `photo-${photoIndex}`);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    
    const data = e.dataTransfer.getData("text/plain");
    
    if (data.startsWith("strip-")) {
      // Moving within strip
      const sourceIndex = parseInt(data.replace("strip-", ""));
      const newStripPhotos = [...stripPhotos];
      const draggedPhoto = stripPhotos[sourceIndex];
      newStripPhotos[sourceIndex] = stripPhotos[targetIndex];
      newStripPhotos[targetIndex] = draggedPhoto;
      setStripPhotos(newStripPhotos);
      onStripPhotosChange(newStripPhotos);
    } else if (data.startsWith("photo-")) {
      // Dropping from photo gallery
      const photoIndex = parseInt(data.replace("photo-", ""));
      if (photoIndex < photos.length) {
        const newStripPhotos = [...stripPhotos];
        newStripPhotos[targetIndex] = photos[photoIndex];
        setStripPhotos(newStripPhotos);
        onStripPhotosChange(newStripPhotos);
      }
    }

  };

  const handleRemoveFromStrip = (index) => {
    const newStripPhotos = [...stripPhotos];
    newStripPhotos[index] = null;
    setStripPhotos(newStripPhotos);
    onStripPhotosChange(newStripPhotos);
  };

  return (
    <Card>
      <CardBody className="p-3">
        <h4 className="text-sm font-semibold mb-2">Photo Strip (4 khung)</h4>
        <p className="text-xs text-gray-600 mb-3">Kéo ảnh vào các khung</p>

        {/* Compact 4 Frames Vertical (1x4) */}
        <div className="bg-green-50 rounded-lg p-2">
          <div className="grid grid-cols-1 gap-2">
            {stripPhotos.map((photo, index) => (
              <div
                key={index}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`relative aspect-[550/700] border-2 border-dashed rounded overflow-hidden transition-all ${
                  photo
                    ? "border-green-500 bg-white"
                    : "border-gray-300 bg-gray-50 hover:border-green-400"
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
                    <div className="absolute top-0.5 right-0.5">
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        variant="flat"
                        className="bg-white/90 backdrop-blur-sm min-w-4 h-4 w-4"
                        onPress={() => handleRemoveFromStrip(index)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-3 h-3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </Button>
                    </div>
                    <div className="absolute bottom-0.5 left-0.5 bg-black/50 text-white text-[10px] px-1 py-0.5 rounded">
                      {index + 1}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <svg
                      className="w-6 h-6 mb-1"
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
                    <p className="text-[10px]">{index + 1}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

