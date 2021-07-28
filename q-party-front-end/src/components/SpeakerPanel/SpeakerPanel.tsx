/**
 * This panel will contain controls for selecting speakers for playback
 * in the house.
 * The user should be able to
 * select the speaker they with to play music on
 * and be able to select multiple to form groups.
 *
 */
import axios from "axios";
import { useEffect, useState } from "react";
import Speaker from "../../types/Speaker";
import SpeakerCard from "../SpeakerCard/SpeakerCard";

function SpeakerPanel() {
  // on render get all available devices and load the device name/ id/ and render checkbox
  let [speakersList, setSpeakersList] = useState([]);
  let [refreshChangeEvent, setRefreshChangeEvent] = useState(false);
  const getDevices = () => {
    const options = {
      url: "http://localhost:8888/getspeakers",
    };
    axios(options).then((response: any) => {
      if (response.data && Array.isArray(response.data)) {
        setRefreshChangeEvent(!refreshChangeEvent);
        setSpeakersList(response.data);
      }
    });
  };
  useEffect(getDevices, []);
  return (
    <div>
      <h1>
        <span>Speaker Panel </span>
        <input
          type='button'
          value='Refresh'
          onClick={() => {
            getDevices();
          }}
        />
      </h1>
      {speakersList.map((speaker: Speaker) => (
        <SpeakerCard
          key={speaker.uuid}
          roomName={speaker.roomName}
          isPlaying={speaker.isPlaying}
          refreshChangeEvent={refreshChangeEvent}
          isInPlayGroup={speaker.isInPlayGroup}
        />
      ))}
    </div>
  );
}

export default SpeakerPanel;
