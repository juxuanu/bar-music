import Head from "next/head";
import Player from "@/components/player";
import VideoQueue from "@/components/video-queue";
import { useCallback, useEffect, useState } from "react";
import SearchOverlay from "@/components/search-overlay";
import { Video } from "@/services/google-api";

const localStorageKeys = {
  videosInQueue: "videosInQueue",
  currentVideo: "currentVideo",
};

export default function Home() {
  const [videosInQueue, setVideosInQueue] = useState<Array<Video>>([]);
  const [currentVideo, setCurrentVideo] = useState<Video>();

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

  const onVideoDown = useCallback(
    (oldIndex: number) => {
      if (oldIndex >= videosInQueue.length - 1) return;
      setVideosInQueue((prevState) => [
        ...prevState.slice(0, oldIndex),
        prevState[oldIndex + 1],
        prevState[oldIndex],
        ...prevState.slice(oldIndex + 2),
      ]);
    },
    [videosInQueue.length]
  );

  const onVideoUp = useCallback((oldIndex: number) => {
    if (oldIndex === 0) return;
    setVideosInQueue((prevState) => [
      ...prevState.slice(0, oldIndex - 1),
      prevState[oldIndex],
      prevState[oldIndex - 1],
      ...prevState.slice(oldIndex + 1),
    ]);
  }, []);

  useEffect(() => {
    let videosInQueueLocalStorage;
    let currentVideoLocalStorage;

    try {
      videosInQueueLocalStorage = JSON.parse(
        localStorage.getItem(localStorageKeys["videosInQueue"]) ?? "[]"
      ) as Array<Video>;
    } catch (e) {
      console.log("No queued videos in local storage");
    }
    try {
      currentVideoLocalStorage = JSON.parse(
        localStorage.getItem(localStorageKeys["currentVideo"]) ?? "{}"
      ) as Video;
    } catch (e) {
      console.log("No current video in local storage");
    }

    if (
      videosInQueueLocalStorage &&
      Array.isArray(videosInQueueLocalStorage) &&
      videosInQueueLocalStorage.length > 0
    )
      setVideosInQueue([...videosInQueueLocalStorage]);

    if (currentVideoLocalStorage) setCurrentVideo(currentVideoLocalStorage);
  }, []);

  useEffect(() => {
    if (videosInQueue.length === 1 && !currentVideo)
      playNextVideo(videosInQueue);
  }, [currentVideo, videosInQueue, videosInQueue.length]);

  useEffect(() => {
    localStorage.setItem(
      localStorageKeys["videosInQueue"],
      JSON.stringify(videosInQueue)
    );
    localStorage.setItem(
      localStorageKeys["currentVideo"],
      JSON.stringify(currentVideo)
    );
  }, [currentVideo, videosInQueue]);

  return (
    <>
      <Head>
        <title>{buildPageTitle(currentVideo?.snippet.title)}</title>
      </Head>
      <div className="mx-auto mt-40 xl:px-2 px-12 max-w-[1600px] flex flex-col xl:flex-row gap-10 justify-between">
        <Player
          video={currentVideo}
          onVideoEnd={() => playNextVideo(videosInQueue)}
          showNextButton={videosInQueue.length > 0}
        />
        <div className="flex flex-col">
          <SearchOverlay onVideoClicked={addVideoToQueue} />
          <VideoQueue
            onVideoDown={onVideoDown}
            onVideoUp={onVideoUp}
            onVideoClicked={setCurrentVideo}
            onVideoRemoved={removeVideoFromQueue}
            videosInQueue={videosInQueue}
          />
        </div>
      </div>
    </>
  );
}

function buildPageTitle(songTitle?: string): string {
  const pre = "Música";

  if (!songTitle) return pre;
  if (songTitle.length > 30)
    return [pre, " · ", songTitle.slice().slice(0, 29), "… "].join(" ");
  return [pre, songTitle].join("  ·  ");
}
