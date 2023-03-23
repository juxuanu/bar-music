type VideoId = string;

interface Props {
  onVideoClicked: (videoId: string) => void;
  videosInQueue: Readonly<VideoId[]>;
}

export default function VideoQueue(props: Props): JSX.Element {
  return (
    <div>
      <h2 className="border-b border-gray-300 border-solid text-lg mb-4">
        Cua
      </h2>
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
    </div>
  );
}
