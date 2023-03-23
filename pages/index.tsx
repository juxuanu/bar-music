import Head from "next/head";
import Player from "@/components/player";
import VideoQueue from "@/components/video-queue";
import { useEffect, useState } from "react";
import SearchOverlay from "@/components/search-overlay";

type VideoId = string;

const localStorageVideosInQueueKey = "videosInQueue";

export default function Home() {
  const [videosInQueue, setVideosInQueue] = useState<Array<string>>([]);
  const [currentVideoId, setCurrentVideoId] = useState<VideoId>("");

  const playNextVideo = () => {
    const nextVideo = videosInQueue[0] ?? "";
    console.debug(nextVideo);
    setVideosInQueue(videosInQueue.length > 0 ? videosInQueue.slice(1) : []);
    setCurrentVideoId(nextVideo);
  };

  useEffect(() => {
    localStorage.setItem(
      localStorageVideosInQueueKey,
      JSON.stringify(videosInQueue)
    );
  });

  useEffect(() => {
    const videosInQueueLocalStorage = JSON.parse(
      localStorage.getItem(localStorageVideosInQueueKey) ?? ""
    ) as Array<string>;
    if (videosInQueueLocalStorage && videosInQueueLocalStorage.length > 0) {
      setVideosInQueue(videosInQueueLocalStorage.slice(1));
      setCurrentVideoId(videosInQueueLocalStorage[0]);
    } else {
      setVideosInQueue(["ORMx45xqWkA"]);
      setCurrentVideoId("dQw4w9WgXcQ");
    }
  }, []);

  return (
    <>
      <Head>
        <title>Música</title>
      </Head>
      <div className="absolute right-1/2 top-20 translate-x-1/2 w-96">
        <SearchOverlay />
      </div>
      <div className="mx-auto mt-40 px-12 max-w-[1600px] flex flex-col sm:flex-row gap-10 justify-between">
        <Player videoId={currentVideoId} onVideoEnd={playNextVideo} />
        <VideoQueue
          onVideoClicked={setCurrentVideoId}
          videosInQueue={videosInQueue}
        />
      </div>
    </>
  );
}
