import axios, { AxiosRequestConfig } from "axios";
import "./QParty.css";
import SearchPanel from "../../components/SearchPanel/SearchPanel";
import SpeakerPanel from "../../components/SpeakerPanel/SpeakerPanel";
import QueuePanel from "../../components/QueuePanel/QueuePanel";
import CurrentSongPanel from "../../components/CurrentSongPanel/currentSongPanel";

function QParty() {
  const getNewToken = () => {
    let options: AxiosRequestConfig = {
      url: "http://localhost:8888/getnewtoken",
    };
    axios(options).then((response) => window.alert(response.data));
  };
  return (
    <div className='q-party-page'>
      <div className='page-top'>
        <button onClick={getNewToken}>Get new token</button>
        <div className='main-header'>QParty</div>
        <CurrentSongPanel />
      </div>
      <div className='panel-row'>
        <div className='speaker-panel'>
          <SpeakerPanel />
        </div>
        <div className='search-panel'>
          <SearchPanel />
        </div>
        <div className='queue-panel'>
          <QueuePanel />
        </div>
      </div>
    </div>
  );
}

export default QParty;
