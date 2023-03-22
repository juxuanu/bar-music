import { useEffect, useState } from "react";

type VideoId = string;

interface Props {
  onVideoClicked: (videoId: string) => void;
  videosInQueue: Readonly<VideoId[]>;
}

export default function VideoQueue(props: Props): JSX.Element {
  return (
    <>
      <ol className="list-decimal list-inside">
        {props.videosInQueue
          .filter((v) => v)
          .map((v) => (
            <li
              className="cursor-pointer hover:bg-neutral-200 rounded transition-colors p-1"
              onClick={() => props.onVideoClicked(v)}
              key={v}
            >
              Video id: {v}
            </li>
          ))}
      </ol>
    </>
  );
}
