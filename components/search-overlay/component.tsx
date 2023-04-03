import { createRef, useCallback, useEffect, useRef, useState } from "react";
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
  const [lastSearchResult, setLastSearchResult] = useState<GoogleResponse>();
  const [videosFound, setVideosFound] = useState<GoogleResponse["items"]>();
  const [showSearchOverlay, setShowSearchOverlay] = useState<boolean>(false);
  const [waitingResultsNewQuery, setWaitingResultsNewQuery] =
    useState<boolean>(false);
  const [waitingResultsNextPage, setWaitingResultsNextPage] =
    useState<boolean>(false);
  const searchInput = createRef<HTMLInputElement>();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery) {
      setWaitingResultsNewQuery(true);
      setShowSearchOverlay(true);
      GoogleAPIService.searchVideos(searchQuery)
        .then((r) => {
          setLastSearchResult(r);
          setVideosFound([]);
          setVideosFound(r.items);
          if (overlayRef && overlayRef.current)
            overlayRef.current.scrollIntoView({ behavior: "smooth" });
        })
        .then(() => setWaitingResultsNewQuery(false))
        .catch((e) => console.error(e));
    }
  }, [searchQuery]);

  const showOverlayIfNeeded = () => {
    if (lastSearchResult || waitingResultsNewQuery) setShowSearchOverlay(true);
  };

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

  const onResultsScrolledToBottom = useCallback(
    (event: any) => {
      if (
        Math.abs(
          event.target.scrollHeight -
            (event.target.scrollTop + event.target.clientHeight)
        ) <= 1
      ) {
        setWaitingResultsNextPage(true);
        GoogleAPIService.searchVideos(
          searchQuery,
          lastSearchResult?.nextPageToken ?? ""
        )
          .then((r) => {
            setLastSearchResult(r);
            setVideosFound([...(lastSearchResult?.items ?? []), ...r.items]);
          })
          .then(() => setWaitingResultsNextPage(false))
          .catch((e) => console.error(e));
      }
    },
    [searchQuery, lastSearchResult]
  );

  return (
    <div className="w-full h-auto z-50 relative">
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
            showOverlayIfNeeded();
          }}
          onBlur={() => setShowSearchOverlay(false)}
          onClick={() => showOverlayIfNeeded()}
        />
        <button
          className="ml-2 p-1 rounded hover:bg-gray-300 duration-500"
          title="Busca (tambe pots apretar Enter)"
          onClick={() => {
            setSearchQuery(
              searchInput.current ? searchInput.current.value : ""
            );
            showOverlayIfNeeded();
          }}
        >
          Busca
        </button>
      </div>
      {showSearchOverlay && (
        <div className="z-50 absolute right-0 max-w-[38rem]">
          <div
            className="mt-2 w-min-[600px] h-fit mx-auto mb-4 p-3 bg-opacity-100 bg-gray-100 shadow-2xl shadow-gray-300 overflow-y-scroll overflow-x-hidden max-h-96 rounded"
            onScroll={onResultsScrolledToBottom}
            ref={overlayRef}
          >
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
            {waitingResultsNewQuery && <Spinner />}
            {videosFound && videosFound.length > 0 && (
              <ul className="space-y-2">
                {videosFound.map((item) => (
                  <li
                    onMouseDown={() => props.onVideoClicked(item)}
                    className="px-2 rounded flex flex-row justify-between cursor-pointer hover:bg-blue-200"
                    key={item.id.videoId}
                  >
                    <VideoCard video={item} />
                    <div className="w-10 h-10 ml-auto my-auto p-1 rounded">
                      {addToQueueIcon}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {waitingResultsNextPage && <Spinner />}
          </div>
        </div>
      )}
    </div>
  );
}
