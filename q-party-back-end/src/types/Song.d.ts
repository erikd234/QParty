export default interface Song {
  trackUri: string;
  trackName: string;
  trackArtist: string;
}

export interface QueueElement {
  uri: string;
  title: string;
  artist: string;
  album: string;
  albumArtUri: string;
}
