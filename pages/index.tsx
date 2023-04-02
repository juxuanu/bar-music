import Head from "next/head";
import Player from "@/components/player";
import VideoQueue from "@/components/video-queue";
import { useEffect, useState } from "react";
import SearchOverlay from "@/components/search-overlay";
import useResize from "@/hooks/use-resize";
import { Video } from "@/services/google-api";

const localStorageVideosInQueueKey = "videosInQueue";

export default function Home() {
  const [videosInQueue, setVideosInQueue] = useState<Array<Video>>([]);
  const [currentVideo, setCurrentVideo] = useState<Video>();
  const [width, setWidth] = useState(0);
  const size = useResize();

  const playNextVideo = (queue: Video[]) => {
    if (queue.length <= 0) return;
    const nextVideo = queue[0];
    setVideosInQueue(queue.length > 0 ? queue.slice(1) : []);
    setCurrentVideo(nextVideo);
  };

  const addVideoToQueue = (video: Video) =>
    setVideosInQueue([...videosInQueue, video]);

  const removeVideoFromQueue = (index: number) =>
    setVideosInQueue([
      ...videosInQueue.slice(0, index),
      ...videosInQueue.slice(index + 1),
    ]);

  useEffect(() => setWidth(size.width), [size.width]);

  useEffect(() => {
    const videosInQueueLocalStorage = JSON.parse(
      localStorage.getItem(localStorageVideosInQueueKey) ?? "[]"
    ) as Array<Video>;
    if (
      videosInQueueLocalStorage &&
      Array.isArray(videosInQueueLocalStorage) &&
      videosInQueueLocalStorage.length > 0
    ) {
      setCurrentVideo(videosInQueueLocalStorage[0]);
      setVideosInQueue([...videosInQueueLocalStorage.slice(1)]);
    }
  }, []);

  useEffect(() => {
    if (videosInQueue.length === 1 && !currentVideo)
      playNextVideo(videosInQueue);
  }, [currentVideo, videosInQueue, videosInQueue.length]);

  return (
    <>
      <Head>
        <title>Música</title>
      </Head>
      <div className="mx-auto mt-40 xl:px-2 px-12 max-w-[1600px] flex flex-col xl:flex-row gap-10 justify-between">
        <Player
          video={currentVideo}
          onVideoEnd={() => playNextVideo(videosInQueue)}
          width={buildPlayerAndQueueWidth(width)}
          showNextButton={videosInQueue.length > 0}
        />
        <div className="flex flex-col">
          <SearchOverlay
            onVideoClicked={(video: Video) => addVideoToQueue(video)}
          />
          <VideoQueue
            onVideoClicked={(video: Video) => setCurrentVideo(video)}
            onVideoRemoved={(index: number) => removeVideoFromQueue(index)}
            videosInQueue={videosInQueue}
          />
        </div>
      </div>
    </>
  );
}

function buildPlayerAndQueueWidth(width: number): number {
  if (width <= 1280) return width;
  return width / 2;
}
