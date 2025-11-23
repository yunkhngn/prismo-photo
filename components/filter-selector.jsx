import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";

const FILTERS = [
  { id: "none", name: "Không filter", filter: "none" },
  { id: "grayscale", name: "Đen trắng", filter: "grayscale(100%)" },
  { id: "sepia", name: "Cổ điển", filter: "sepia(100%)" },
  { id: "brightness", name: "Sáng", filter: "brightness(1.2)" },
  { id: "contrast", name: "Tương phản", filter: "contrast(1.3)" },
  { id: "saturate", name: "Màu sắc", filter: "saturate(1.5)" },
  { id: "vintage", name: "Vintage", filter: "sepia(50%) contrast(1.2) brightness(0.9)" },
  { id: "cool", name: "Mát mẻ", filter: "brightness(0.9) contrast(1.1) saturate(0.8)" },
];

export default function FilterSelector({ selectedFilter, onFilterChange, photos }) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const applyFilterToImage = (imageUrl, filter) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.filter = filter;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          const filteredUrl = URL.createObjectURL(blob);
          resolve(filteredUrl);
        }, "image/jpeg", 0.9);
      };
      img.src = imageUrl;
    });
  };

  const handleFilterSelect = async (filterId) => {
    const filter = FILTERS.find((f) => f.id === filterId);
    if (!filter || !photos[selectedPhotoIndex]) return;

    const filteredUrl = await applyFilterToImage(
      photos[selectedPhotoIndex],
      filter.filter
    );
    onFilterChange(selectedPhotoIndex, filteredUrl);
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Vui lòng chụp ảnh trước khi chọn filter</p>
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {FILTERS.map((filter) => (
          <Card
            key={filter.id}
            isPressable
            onPress={() => handleFilterSelect(filter.id)}
            className={`cursor-pointer ${
              selectedFilter === filter.id ? "ring-2 ring-primary" : ""
            }`}
          >
            <CardBody className="p-2">
              <div className="relative aspect-square rounded overflow-hidden">
                {photos[selectedPhotoIndex] && (
                  <img
                    src={photos[selectedPhotoIndex]}
                    alt={filter.name}
                    className="w-full h-full object-cover"
                    style={{ filter: filter.filter }}
                  />
                )}
              </div>
              <p className="text-xs text-center mt-2">{filter.name}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

