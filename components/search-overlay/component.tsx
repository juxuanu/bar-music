import { createRef, useCallback, useEffect, useState } from "react";
import { GoogleAPIService, GoogleResponse, Video } from "@/services/google-api";
import VideoCard from "@/components/video-card";
import Spinner from "@/components/spinner";

interface Props {
  onVideoClicked: (video: Video) => void;
}

const addToQueueIcon = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 5H14V7H2V5Z" fill="currentColor" />
    <path d="M2 9H14V11H2V9Z" fill="currentColor" />
    <path d="M10 13H2V15H10V13Z" fill="currentColor" />
    <path d="M16 9H18V13H22V15H18V19H16V15H12V13H16V9Z" fill="currentColor" />
  </svg>
);

export default function SearchOverlay(props: Props): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<GoogleResponse>();
  const [showSearchOverlay, setShowSearchOverlay] = useState<boolean>(false);
  const [waitingResults, setWaitingResults] = useState<boolean>(false);
  const searchInput = createRef<HTMLInputElement>();

  useEffect(() => {
    if (searchQuery) {
      setWaitingResults(true);
      setShowSearchOverlay(true);
      setWaitingResults(false);
      GoogleAPIService.searchVideos(searchQuery)
        .then((r) => setSearchResults(r))
        .catch((e) => console.error(e));
    }
  }, [searchQuery]);

  const onSearchInput = useCallback((event: any) => {
    if (event.key === "Enter") {
      setSearchQuery(event.currentTarget.value);
      setShowSearchOverlay(true);
      return;
    } else if (event.key === "Escape") {
      setShowSearchOverlay(false);
      return;
    }
  }, []);

  return (
    <div className="w-[38rem] h-auto z-50 relative">
      <div className="mx-auto flex flex-row flex-nowrap justify-center relative">
        <input
          ref={searchInput}
          className="p-1 rounded border border-solid border-gray-300 shadow-gray-400 shadow-2xl w-auto h-auto"
          tabIndex={0}
          autoFocus={true}
          type={"search"}
          inputMode={"search"}
          onKeyUp={onSearchInput}
          onFocus={() => {
            if (searchResults) setShowSearchOverlay(true);
          }}
          onBlur={() => setShowSearchOverlay(false)}
        />
        <button
          className="ml-2 p-1 rounded hover:bg-gray-300 duration-500"
          title="Busca (tambe pots apretar Enter)"
          onClick={() => {
            setSearchQuery(
              searchInput.current ? searchInput.current.value : ""
            );
            setShowSearchOverlay(true);
          }}
        >
          Busca
        </button>
      </div>
      {showSearchOverlay && (
        <div className="z-50 absolute right-0 max-w-[38rem]">
          <div className="mt-2 w-min-[600px] h-fit mx-auto mb-4 p-3 bg-opacity-100 bg-gray-100 shadow-2xl shadow-gray-300 overflow-y-scroll overflow-x-hidden max-h-96 rounded">
            <div className="w-full h-fit my-2 flex flex-row flex-nowrap justify-center">
              <p className="w-fit h-fit my-auto">
                Resultats per &lsquo;{searchQuery}&lsquo;
              </p>
              <p
                className="w-fit h-fit p-1 my-auto ml-auto cursor-pointer rounded hover:bg-gray-300 transition-colors"
                onClick={() => setShowSearchOverlay(false)}
              >
                Tanca
              </p>
            </div>
            {waitingResults && <Spinner />}
            {searchResults && searchResults.items.length > 0 && (
              <ul className="space-y-2">
                {searchResults.items.slice(0, 10).map((item) => (
                  <li
                    onMouseDown={() => props.onVideoClicked(item)}
                    className="px-2 rounded flex flex-row justify-between cursor-pointer hover:bg-blue-200"
                    key={item.id.videoId}
                  >
                    <VideoCard video={item} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
