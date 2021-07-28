import axios from "axios";
import { qSocket, QSocketEvents } from "../../helpers/qSocket";

function MusicCard(props: any) {
  const socket = qSocket.socket;
  const playUri = () => {
    const options = {
      url: `http://localhost:8888/play/${props.trackUri}`,
    };
    axios(options)
      .then((response) => {
        window.alert("request was success");
        console.log(response.data);
      })
      .catch((err) => {
        window.alert("request failed.");
        console.log(err);
      });
  };
  const addToQueue = () => {
    // sending all the musicCard properties
    socket.emit(QSocketEvents.addQueue, props);
  };
  return (
    <div className='card-container'>
      {props.trackName}, {props.trackArtist}
      <button onClick={playUri}>Play</button>
      <button onClick={addToQueue}>Queue</button>
    </div>
  );
}

export default MusicCard;
