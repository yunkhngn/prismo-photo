# Prismo Booth 📸

Prismo Booth is a fun, client-side online photobooth application featuring a playful "Claymorphism" design style. Capture moments, apply filters, choose frames, and download your photo strips instantly!

## Features

- **Client-Side Privacy**: All photos are processed locally in your browser. No images are uploaded to any server.
- **Live Camera Capture**: Use your webcam to capture photos with a countdown timer.
- **Auto & Manual Modes**: Take photos one by one or let the booth guide you through a sequence.
- **Filters**: Apply fun color filters (B&W, Sepia, Warm, Cool, Vintage) to your photos.
- **Frame Selection**: Choose from a variety of built-in frames (Cute, Cool, Vintage).
- **Custom Frames**: Upload your own frame overlay to personalize your strip.
- **High-Quality Export**: Download your final photo strip as a high-resolution PNG.
- **Responsive Design**: Works on desktop and mobile devices.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + Custom Claymorphism components
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Canvas Rendering**: [Fabric.js](http://fabricjs.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/prismo-photo.git
    cd prismo-photo
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

4.  **Open the app:**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: React components.
    - `ui/`: Reusable UI components (shadcn/ui + Clay).
    - `photobooth/`: Photobooth-specific components (Camera, Sidebar, Export).
- `store/`: Zustand state management (`usePhotoboothStore`).
- `hooks/`: Custom hooks (`useCamera`).
- `lib/`: Utility functions and configurations (`frames.js`, `layouts.js`).
- `public/`: Static assets (frames, icons).

## Customization

- **Frames**: Add new frame definitions in `lib/frames.js` and place assets in `public/frames/`.
- **Layouts**: Configure photo strip layouts in `lib/layouts.js`.
- **Theme**: Adjust Tailwind colors and shadows in `app/globals.css`.

## License

MIT
