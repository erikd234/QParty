import axios from "axios";
import { useEffect, useState } from "react";
import "./SpeakerCard.css";

function SpeakerCard(props: any) {
  let [isChecked, setIsChecked] = useState(props.isInPlayGroup);

  useEffect(() => {
    if (props.isInPlayGroup !== isChecked) {
      setIsChecked(props.isInPlayGroup);
    }
    console.log("State should have been updated");
  }, [props.refreshChangeEvent]);
  const changeSpeakerState = () => {
    if (!isChecked) {
      const options = {
        url: "http://localhost:8888/addspeaker/" + props.roomName,
      };
      axios(options).then(() => {});
    } else {
      const options = {
        url: "http://localhost:8888/removespeaker/" + props.roomName,
      };
      axios(options).then(() => {});
    }
    setIsChecked(!isChecked);
  };
  return (
    <div>
      <p className='speaker-name'>{props.roomName}</p>
      <input
        type='checkBox'
        checked={isChecked}
        style={{ transform: "scale(1.5)", margin: 20 }}
        onChange={changeSpeakerState}
      />
      <p className='state-info'>{props.isPlaying ? "State: Playing" : "State: Not Playing"}</p>
    </div>
  );
}

export default SpeakerCard;
