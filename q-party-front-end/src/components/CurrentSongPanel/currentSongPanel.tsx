import axios from "axios";
import { useEffect, useState } from "react";
import { qSocket, QSocketEvents } from "../../helpers/qSocket";
import Song from "../../types/Song";

export default function CurrentSongPanel() {
  let [currentSong, setCurrentSong] = useState({} as Song);
  useEffect(() => {
    const options = {
      url: "localhost:8888/currentsong",
    };
    axios(options).then((response) => {
      let song: Song = response.data;
      setCurrentSong(song);
    });
    qSocket.socket.on(QSocketEvents.stateChange, (song: Song) => {
      setCurrentSong(song);
    });
  }, []);
  return (
    <div>
      {" "}
      Currently Playing: {currentSong.trackName} by {currentSong.trackArtist}
    </div>
  );
}
