import { getVideos } from "@/lib/videos";
import VideosGallery from "./VideosGallery";

export default async function VideosPage() {
  const videos = await getVideos();
  return <VideosGallery videos={videos} />;
}
