import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";

export default function PhotoGallery({ photos, onDelete, onRetake }) {
  if (photos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Chưa có ảnh nào. Hãy chụp ảnh để bắt đầu!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => {
        const photo = photos[index];
        return (
          <Card key={index} className="relative aspect-square">
            <CardBody className="p-0">
              {photo ? (
                <>
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors rounded-lg flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
                      onPress={() => onDelete(index)}
                    >
                      Xóa
                    </Button>
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      onPress={() => onRetake(index)}
                    >
                      Chụp lại
                    </Button>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                  <span className="text-gray-400 text-sm">Ảnh {index + 1}</span>
                </div>
              )}
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}

