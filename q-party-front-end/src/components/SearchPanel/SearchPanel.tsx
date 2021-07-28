import SearchBar from "../SearchBar/SearchBar";
import MusicCard from "../MusicCard/MusicCard";
import { TrackSearchItem } from "../../types/TrackSearch";
import { useState } from "react";

function SearchPanel() {
  let [trackSearchResults, setTrackSearchResults] = useState<TrackSearchItem[]>([]);
  const handleTrackSearchResults = (tracks: TrackSearchItem[]) => {
    setTrackSearchResults(tracks);
  };
  return (
    <div>
      <h1>Search for Songs</h1>
      <SearchBar handleTrackSearchResults={handleTrackSearchResults} />
      {trackSearchResults.map((track) => (
        <MusicCard key={track.id} trackName={track.name} trackArtist={track.artists[0].name} trackUri={track.uri} />
      ))}
    </div>
  );
}
export default SearchPanel;
