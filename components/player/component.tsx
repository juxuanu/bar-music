import YouTube from "react-youtube";
import { useEffect, useState } from "react";

interface Props {
  videoId: string;
}

export default function Player(props: Props): JSX.Element {
  const [videoId, setVideoId] = useState(props.videoId);
  useEffect(() => setVideoId(props.videoId), [props.videoId]);

  return (
    <div className="border border-solid border-black w-[640px] h-[360px]">
      {videoId ? (
        <YouTube videoId={videoId} loading="lazy" />
      ) : (
        <div className="mx-auto p-8 w-fit h-fit">Cap vídeo seleccionat</div>
      )}
    </div>
  );
}
