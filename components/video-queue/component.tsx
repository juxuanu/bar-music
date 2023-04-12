import { Video } from "@/services/google-api";
import VideoCard from "@/components/video-card";
import { useEffect, useState } from "react";
import {
  arrowDown,
  arrowUp,
  deleteFromQueueIcon,
} from "@/components/video-queue/icons";

interface Props {
  onVideoClicked: (video: Video) => void;
  onVideoRemoved: (index: number) => void;
  onVideoUp: (oldIndex: number) => void;
  onVideoDown: (oldIndex: number) => void;
  videosInQueue: Readonly<Video[]>;
}

export default function VideoQueue(props: Props): JSX.Element {
  const [videos, setVideos] = useState<Readonly<Video[]>>(props.videosInQueue);

  useEffect(() => setVideos(props.videosInQueue), [props.videosInQueue]);

  return (
    <div className="xl:w-[35rem] w-full">
      <h2 className="border-b border-gray-300 border-solid text-lg mb-4 mt-2">
        Cua
      </h2>
      {videos.length <= 0 && (
        <p className="font-light text-sm mx-auto w-fit">Cap vídeo a la cua</p>
      )}
      <ol>
        {videos
          .filter((v) => v)
          .map((v, index) => (
            <li
              className="rounded p-1 grid grid-cols-10"
              onClick={() => props.onVideoClicked(v)}
              key={v.id.videoId}
            >
              <VideoCard
                video={v}
                className="col-span-9 cursor-pointer rounded hover:bg-blue-200 transition-colors duration-500"
              />
              <div className="col-span-1 grid grid-cols-1 grid-rows-3">
                <div
                  className="w-8 h-8 my-auto row-span-1 p-1 rounded cursor-pointer hover:bg-gray-300 transition-colors duration-500"
                  onClick={(event: any) => {
                    event.stopPropagation();
                    props.onVideoUp(index);
                  }}
                >
                  {arrowUp}
                </div>
                <div
                  className="w-8 h-8 my-auto row-span-1 p-1 rounded cursor-pointer hover:bg-red-400 transition-colors duration-500"
                  onClick={(event: any) => {
                    event.stopPropagation();
                    props.onVideoRemoved(index);
                  }}
                >
                  {deleteFromQueueIcon}
                </div>
                <div
                  className="w-8 h-8 my-auto row-span-1 p-1 rounded cursor-pointer hover:bg-gray-300 transition-colors duration-500"
                  onClick={(event: any) => {
                    event.stopPropagation();
                    props.onVideoDown(index);
                  }}
                >
                  {arrowDown}
                </div>
              </div>
            </li>
          ))}
      </ol>
    </div>
  );
}
