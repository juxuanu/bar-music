import YouTube, { YouTubePlayer } from "react-youtube";
import { useEffect, useRef, useState } from "react";
import Spinner from "@/components/spinner";
import { Video } from "@/services/google-api";
import {
  nextButton,
  pauseButton,
  playButton,
} from "@/components/player/buttons";

interface Props {
  video?: Video | null;
  onVideoEnd: () => void;
  showNextButton?: boolean;
  width: number;
}

let videoElement: YouTubePlayer | null = null;

export default function Player(props: Props): JSX.Element {
  const [video, setVideo] = useState(props.video);
  const [playerLoading, setPlayerLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [width, setWidth] = useState(props.width);
  const youtubeElement = useRef<YouTube>(null);

  useEffect(() => setVideo(props.video), [props.video]);
  useEffect(
    () =>
      setIsPlaying(videoElement && videoElement.target.getPlayerState() === 1),
    []
  );
  useEffect(() => setWidth(props.width), [props.width]);

  return (
    <div className="relative" style={{ width: props.width }}>
      {playerLoading && video && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Spinner />
        </div>
      )}
      {video ? (
        <div className="h-hit w-fit">
          <YouTube
            videoId={video ? video.id.videoId : ""}
            className="-z-10 mx-auto h-fit w-fit"
            loading="lazy"
            onEnd={() => {
              setPlayerLoading(true);
              setIsPlaying(false);
              props.onVideoEnd();
            }}
            onReady={(event: YouTubePlayer) => {
              videoElement = event;
              setPlayerLoading(false);
              if (youtubeElement.current) youtubeElement.current;
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            opts={{
              // https://developers.google.com/youtube/player_parameters
              playerVars: {
                autoplay: process.env.NODE_ENV === "production" ? 1 : 0,
                cc_lang_pref: window.navigator.language,
                disablekb: 1,
                hl: window.navigator.language,
                iv_load_policy: 3,
                modestbranding: 1,
                playsinline: 1,
              },
            }}
          />
          <div className="flex flex-row gap-5 w-fit h-fit mx-auto mt-3">
            <button
              className="w-12 h-12"
              onClick={() => {
                if (videoElement)
                  isPlaying
                    ? videoElement.target.pauseVideo()
                    : videoElement.target.playVideo();
              }}
            >
              {isPlaying ? pauseButton : playButton}
            </button>
            {props.showNextButton ? (
              <button className="w-12 h-12" onClick={props.onVideoEnd}>
                {nextButton}
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        <div className="mx-auto p-8 w-fit h-fit font-light text-sm">
          Cap vídeo en reproducció
        </div>
      )}
    </div>
  );
}
