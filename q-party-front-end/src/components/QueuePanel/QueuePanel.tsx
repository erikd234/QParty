import { useEffect } from "react";
import { useState } from "react";
import { qSocket, QSocketEvents } from "../../helpers/qSocket";
import Song from "../../types/Song";
import MusicCard from "../MusicCard/MusicCard";

function QueuePanel() {
  const socket = qSocket.socket;
  let [songQueue, setSongQueue] = useState([] as Song[]);

  useEffect(() => {
    socket.on(QSocketEvents.queueChange, function (songQueue: Song[]) {
      if (!songQueue) return;
      setSongQueue(songQueue);
    });
  }, [socket]);
  return (
    <div>
      <h1>Song Queue</h1>
      {songQueue.map((song: Song) => (
        <MusicCard
          key={song.trackUri}
          trackName={song.trackName}
          trackArtist={song.trackArtist}
          trackUri={song.trackUri}
        />
      ))}
    </div>
  );
}

export default QueuePanel;
