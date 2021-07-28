import { useState } from "react";
import axios from "axios";
import { TrackSearchItem } from '../../types/TrackSearch'

function SearchBar(props: any) {
    let [text, setText] = useState("");
    const search = (query: string) => {
        if (query.length === 0) return;
        const urlSafeQuery = encodeURI(query);
        const options = {
            url: `http://localhost:8888/search?q=${urlSafeQuery}`,
        };
        axios(options)
            .then((response) => {
                if (response.data === "invalid AccessToken") return;
                const dataItems: TrackSearchItem[] = response.data.tracks.items;
                props.handleTrackSearchResults(dataItems);
            })
            .catch((err) => {
                window.alert("failure");
                console.log(err);
            });
    };
    return (
        <div>
            <input
                type='text'
                onChange={(e) => {
                    setText(e.target.value);
                }}
            />
            <input
                onClick={() => {
                    search(text);
                }}
                type='button'
                value='Search Track'
            />
        </div>
    );
}

export default SearchBar;
