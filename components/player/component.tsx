import YouTube, { YouTubeProps } from "react-youtube";
import { useEffect, useState } from "react";

interface Props {
  videoId: string;
  onVideoEnd: () => void;
}

export default function Player(props: Props): JSX.Element {
  const [videoId, setVideoId] = useState(props.videoId);
  useEffect(() => setVideoId(props.videoId), [props.videoId]);

  return (
    <div className="border border-solid border-black w-[640px] h-[360px]">
      {videoId ? (
        <YouTube
          videoId={videoId}
          loading="lazy"
          onEnd={props.onVideoEnd}
          opts={{
            // https://developers.google.com/youtube/player_parameters
            playerVars: {
              autoplay: 1,
              cc_lang_pref: window.navigator.language,
              disablekb: 1,
              hl: window.navigator.language,
              iv_load_policy: 3,
              modestbranding: 1,
              playsinline: 1,
            },
          }}
        />
      ) : (
        <div className="mx-auto p-8 w-fit h-fit">Cap vídeo en reproducció</div>
      )}
    </div>
  );
}
