import { Video } from "@/services/google-api";
import VideoCard from "@/components/video-card";
import { useEffect, useState } from "react";

interface Props {
  onVideoClicked: (video: Video) => void;
  onVideoRemoved: (index: number) => void;
  videosInQueue: Readonly<Video[]>;
}

const deleteFromQueueIcon = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15.9644 4.63379H3.96442V6.63379H15.9644V4.63379Z"
      fill="currentColor"
    />
    <path
      d="M15.9644 8.63379H3.96442V10.6338H15.9644V8.63379Z"
      fill="currentColor"
    />
    <path
      d="M3.96442 12.6338H11.9644V14.6338H3.96442V12.6338Z"
      fill="currentColor"
    />
    <path
      d="M12.9645 13.7093L14.3787 12.295L16.5 14.4163L18.6213 12.2951L20.0355 13.7093L17.9142 15.8305L20.0356 17.9519L18.6214 19.3661L16.5 17.2447L14.3786 19.3661L12.9644 17.9519L15.0858 15.8305L12.9645 13.7093Z"
      fill="currentColor"
    />
  </svg>
);

export default function VideoQueue(props: Props): JSX.Element {
  const [videos, setVideos] = useState<Readonly<Video[]>>(props.videosInQueue);

  useEffect(() => setVideos(props.videosInQueue), [props.videosInQueue]);

  return (
    <div className="w-[35rem]">
      <h2 className="border-b border-gray-300 border-solid text-lg mb-4">
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
              className="rounded p-1 flex flex-row"
              onClick={() => props.onVideoClicked(v)}
              key={v.id.videoId}
            >
              <VideoCard
                video={v}
                className="cursor-pointer rounded hover:bg-blue-200 transition-colors duration-500"
              />
              <div
                className="w-10 h-10 ml-auto my-auto p-1 rounded cursor-pointer hover:bg-red-400 transition-colors duration-500"
                onClick={(event: any) => {
                  event.stopPropagation();
                  props.onVideoRemoved(index);
                }}
              >
                {deleteFromQueueIcon}
              </div>
            </li>
          ))}
      </ol>
    </div>
  );
}
