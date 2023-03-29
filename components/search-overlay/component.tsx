import { useCallback, useEffect, useState } from "react";
import { GoogleAPIService, GoogleResponse } from "@/services/google-api";
import Image from "next/image";

interface Props {
  onVideoClicked: (videoId: string) => void;
}

export default function SearchOverlay(props: Props): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<GoogleResponse>();
  const [showSearchOverlay, setShowSearchOverlay] = useState<boolean>(false);

  useEffect(() => {
    if (searchQuery)
      GoogleAPIService.searchVideos(searchQuery)
        .then((r) => setSearchResults(r))
        .catch((e) => console.error(e));
  }, [searchQuery]);

  const onSearchInput = useCallback((event: any) => {
    if (event.key === "Enter") {
      setSearchQuery(event.currentTarget.value);
      setShowSearchOverlay(true);
    }
  }, []);

  return (
    <div className="w-full h-full z-20">
      <input
        className="p-1 rounded border border-solid border-gray-300 shadow-gray-400 shadow-2xl w-full h-full"
        tabIndex={0}
        autoFocus={true}
        type={"search"}
        inputMode={"search"}
        onKeyUp={onSearchInput}
      />
      {showSearchOverlay && searchResults && searchResults.items.length > 0 && (
        <div className="w-min-[600px] h-fit mx-auto mb-4 p-3 bg-opacity-100 bg-gray-100 shadow-2xl shadow-gray-300">
          <ul className="space-y-2">
            {searchResults.items.slice(0, 10).map((item) => (
              <li
                className="cursor-pointer hover:bg-blue-200 px-2 rounded flex flex-row justify-between"
                key={item.id.videoId}
                onClick={() => {
                  props.onVideoClicked(item.id.videoId);
                  setShowSearchOverlay(false);
                }}
              >
                <div>{item.snippet.title}</div>
                <div>
                  <Image
                    width={item.snippet.thumbnails.default.width}
                    height={item.snippet.thumbnails.default.height}
                    alt={item.snippet.title + " thumbnail"}
                    src={item.snippet.thumbnails.default.url}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
