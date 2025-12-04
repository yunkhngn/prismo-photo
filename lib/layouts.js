export const DEFAULT_LAYOUTS = [
        id: "1x4-vertical",
        name: "Classic Strip (1x4)",
        canvasWidth: 640,
        canvasHeight: 2500, // Matches frame-1 ratio (~1:3.9)
        slots: [
            { id: "slot-1", x: 55, y: 300, width: 530, height: 400 }, // Centered in the frame hole
            { id: "slot-2", x: 55, y: 720, width: 530, height: 400 },
            { id: "slot-3", x: 55, y: 1140, width: 530, height: 400 },
            { id: "slot-4", x: 55, y: 1560, width: 530, height: 400 },
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
