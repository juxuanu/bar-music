import { Video } from "@/services/google-api";

interface Props {
  video: Video;
  className: string;
}

export default function VideoCard(props: Props) {
  return (
    <div
      className={[
        "grid grid-cols-5 p-2 w-full h-full justify-around",
        props.className,
      ].join(" ")}
    >
      <div className="w-20 h-auto col-span-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          style={{ width: props.video.snippet.thumbnails.default.width }}
          alt={props.video.snippet.title + " thumbnail"}
          src={props.video.snippet.thumbnails.default.url}
          className="h-auto my-auto mx-auto overflow-hidden rounded"
        />
      </div>
      <div className="flex flex-col overflow-hidden col-span-4">
        <div
          dangerouslySetInnerHTML={{
            __html:
              props.video.snippet.title.length > 50
                ? props.video.snippet.title.slice(0, 50) + "..."
                : props.video.snippet.title,
          }}
        ></div>
        <div
          className="font-light text-sm"
          dangerouslySetInnerHTML={{ __html: props.video.snippet.channelTitle }}
        ></div>
      </div>
    </div>
  );
}
