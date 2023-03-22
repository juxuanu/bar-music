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

  useEffect(() => {
    localStorage.setItem(
      localStorageVideosInQueueKey,
      JSON.stringify(videosInQueue)
    );
  }, [videosInQueue]);

  useEffect(() => {
    const videosInQueueLocalStorage = JSON.parse(
      localStorage.getItem(localStorageVideosInQueueKey) ?? ""
    ) as Array<string>;
    if (videosInQueueLocalStorage && videosInQueueLocalStorage.length > 0)
      setVideosInQueue(() => videosInQueueLocalStorage);
    else setVideosInQueue(() => ["dQw4w9WgXcQ", "ORMx45xqWkA"]);
  }, []);

  return (
    <>
      <Head>
        <title>Música</title>
      </Head>
      <div className="absolute right-1/2 top-20 translate-x-1/2 w-96">
        <SearchOverlay />
      </div>
      <div className="mx-auto mt-40 px-12 max-w-[1600px]">
        <div className="mx-auto flex flex-col sm:flex-row">
          <Player videoId={currentVideoId} />
          <VideoQueue
            onVideoClicked={setCurrentVideoId}
            videosInQueue={videosInQueue}
          />
        </div>
      </div>
    </>
  );
}
