import { DuoApp } from "@/components/duo/DuoApp";

export default async function RoomPage({ params }) {
  const { roomId } = await params;
  return <DuoApp roomId={roomId} />;
}
