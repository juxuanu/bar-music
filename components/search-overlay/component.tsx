import { FormEvent, useCallback, useEffect, useState } from "react";
import { GoogleAPIService, GoogleResponse } from "@/services/google-api";

interface Props {
  onVideoClicked: (videoId: string) => void;
}
export default function SearchOverlay(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<GoogleResponse>();

  useEffect(() => {
    if (searchQuery)
      GoogleAPIService.searchVideos(searchQuery)
        .then((r) => setSearchResults(r))
        .catch((e) => console.error(e));
  }, [searchQuery]);

  const onSearchInput = useCallback((event: FormEvent<HTMLInputElement>) => {
    // TODO: throttle

    setSearchQuery(event.currentTarget.value);
  }, []);

  return (
    <div className="w-full h-full">
      <input
        className="p-1 rounded border border-solid border-gray-300 shadow-gray-400 shadow-2xl w-full h-full"
        tabIndex={0}
        autoFocus={true}
        type={"search"}
        inputMode={"search"}
        onInput={onSearchInput}
      />
    </div>
  );
}
