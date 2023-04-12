import { Video } from "@/services/google-api";
import parseString from "@/services/string-parser";

interface Props {
  video: Video;
  className?: string;
}

export default function VideoCard(props: Props) {
  return (
    <div
      className={[
        "grid grid-cols-10 grid-rows-2 xl:grid-rows-1 space-x-0 p-2 w-full h-full justify-around",
        props.className,
      ].join(" ")}
    >
      <div className="w-20 h-fit col-span-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          style={{ width: props.video.snippet.thumbnails.default.width }}
          alt={props.video.snippet.title + " thumbnail"}
          src={props.video.snippet.thumbnails.default.url}
          className="h-auto my-auto mx-auto overflow-hidden rounded"
        />
      </div>
      <div className="xl:flex xl:flex-col xl:col-span-8 overflow-hidden col-span-9">
        <div>
          {parseString(
            props.video.snippet.title.length > 100
              ? props.video.snippet.title.slice(0, 100) + "… "
              : props.video.snippet.title
          )}
        </div>
        <div className="font-light text-sm">
          {parseString(props.video.snippet.channelTitle)}
        </div>
      </div>
    </div>
  );
}
