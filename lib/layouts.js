import { LayoutConfig } from "@/types";

export const DEFAULT_LAYOUTS: LayoutConfig[] = [
    {
        id: "1x4-vertical",
        name: "Classic Strip (1x4)",
        canvasWidth: 600,
        canvasHeight: 1800, // 4:12 ratio roughly
        slots: [
            { id: "slot-1", x: 50, y: 50, width: 500, height: 375 }, // 4:3 aspect ratio photos
            { id: "slot-2", x: 50, y: 475, width: 500, height: 375 },
            { id: "slot-3", x: 50, y: 900, width: 500, height: 375 },
            { id: "slot-4", x: 50, y: 1325, width: 500, height: 375 },
        ],
    },
    {
        id: "2x2-grid",
        name: "Grid (2x2)",
        canvasWidth: 1200,
        canvasHeight: 1800,
        slots: [
            { id: "slot-1", x: 50, y: 50, width: 525, height: 700 },
            { id: "slot-2", x: 625, y: 50, width: 525, height: 700 },
            { id: "slot-3", x: 50, y: 800, width: 525, height: 700 },
            { id: "slot-4", x: 625, y: 800, width: 525, height: 700 },
        ],
    }
];
