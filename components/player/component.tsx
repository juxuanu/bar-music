import YouTube from "react-youtube";
import { useEffect, useState } from "react";

interface Props {
  videoId: string;
}

export default function Player(props: Props): JSX.Element {
  const [videoId, setVideoId] = useState(props.videoId);
  useEffect(() => setVideoId(props.videoId), [props.videoId]);

  return (
    <div className="w-full h-full">
      {videoId && <YouTube videoId={videoId} />}
    </div>
  );
}
