import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import CameraCapture from "./CameraCapture";
import PhotoGallery from "./PhotoGallery";
import FilterSelector from "./FilterSelector";
import FrameSelector from "./FrameSelector";
import ExportButton from "./ExportButton";

export default function PhotoEditor() {
  const [photos, setPhotos] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [retakeIndex, setRetakeIndex] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [selectedFrame, setSelectedFrame] = useState("none");

  const handleCapture = (imageUrl) => {
    if (retakeIndex !== null) {
      // Replace photo at specific index
      const newPhotos = [...photos];
      newPhotos[retakeIndex] = imageUrl;
      setPhotos(newPhotos);
      setRetakeIndex(null);
    } else {
      // Add new photo
      if (photos.length < 4) {
        setPhotos([...photos, imageUrl]);
      }
    }
    setShowCamera(false);
  };

  const handleDelete = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  const handleRetake = (index) => {
    setRetakeIndex(index);
    setShowCamera(true);
  };

  const handleFilterChange = (index, filteredUrl) => {
    const newPhotos = [...photos];
    newPhotos[index] = filteredUrl;
    setPhotos(newPhotos);
    setSelectedFilter(filteredUrl);
  };

  const handleFrameChange = (index, framedUrl) => {
    const newPhotos = [...photos];
    newPhotos[index] = framedUrl;
    setPhotos(newPhotos);
    setSelectedFrame(framedUrl);
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
    setRetakeIndex(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Card>
        <CardHeader className="flex flex-col gap-2 p-6">
          <h1 className="text-3xl font-bold text-center">Prismo Photo</h1>
          <p className="text-center text-gray-600">Photobooth Online - Tạo những bức ảnh đẹp và kỷ niệm</p>
        </CardHeader>
        <CardBody className="p-6">
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                color="primary"
                size="lg"
                onPress={() => {
                  if (photos.length < 4) {
                    setShowCamera(true);
                  } else {
                    alert("Bạn đã chụp đủ 4 ảnh. Vui lòng xóa một ảnh để chụp ảnh mới.");
                  }
                }}
                isDisabled={photos.length >= 4}
              >
                📸 Chụp ảnh mới
              </Button>
              <ExportButton photos={photos} />
            </div>

            {/* Photo Gallery */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Ảnh đã chụp ({photos.length}/4)</h2>
              <PhotoGallery
                photos={photos}
                onDelete={handleDelete}
                onRetake={handleRetake}
              />
            </div>

            {/* Tabs for Filter and Frame */}
            {photos.length > 0 && (
              <Tabs aria-label="Photo editing options" className="w-full">
                <Tab key="filter" title="Filter">
                  <div className="p-4">
                    <FilterSelector
                      selectedFilter={selectedFilter}
                      onFilterChange={handleFilterChange}
                      photos={photos}
                    />
                  </div>
                </Tab>
                <Tab key="frame" title="Frame">
                  <div className="p-4">
                    <FrameSelector
                      selectedFrame={selectedFrame}
                      onFrameChange={handleFrameChange}
                      photos={photos}
                    />
                  </div>
                </Tab>
              </Tabs>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCapture}
          onClose={handleCloseCamera}
        />
      )}
    </div>
  );
}

