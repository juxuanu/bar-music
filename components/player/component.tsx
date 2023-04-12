import YouTube, { YouTubePlayer } from "react-youtube";
import { useCallback, useEffect, useRef, useState } from "react";
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
}

let videoElement: YouTubePlayer | null = null;

export default function Player(props: Props): JSX.Element {
  const [video, setVideo] = useState(props.video);
  const [playerLoading, setPlayerLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const youtubeElement = useRef<YouTube>(null);

  useEffect(() => setVideo(props.video), [props.video]);
  useEffect(
    () =>
      setIsPlaying(videoElement && videoElement.target.getPlayerState() === 1),
    []
  );

  const onVideoLoad = useCallback(() => {
    if (youtubeElement.current && youtubeElement.current.container)
      youtubeElement.current.container.className = "youtubeContainer";
  }, []);

  return (
    <div className="relative xl:w-2/5">
      {playerLoading && video && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Spinner />
        </div>
      )}
      {video ? (
        <div className="h-fit w-full mx-auto">
          <div
            className="text-lg p-1"
            dangerouslySetInnerHTML={{ __html: video.snippet.title }}
          ></div>
          <YouTube
            ref={youtubeElement}
            videoId={video.id.videoId}
            className="-z-10 w-full h-auto mx-auto"
            loading="lazy"
            onEnd={() => {
              setPlayerLoading(true);
              setIsPlaying(false);
              props.onVideoEnd();
            }}
            onReady={(event: YouTubePlayer) => {
              videoElement = event;
              setPlayerLoading(false);
              onVideoLoad();
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
