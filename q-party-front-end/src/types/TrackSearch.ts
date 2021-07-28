export interface TrackSearchItem {
  id: string;
  //images :  to impliment maybe
  name: string;
  uri: string;
  artists: TrackArtist[];
}
export interface TrackArtist {
  name: string;
  id: string;
  uri: string;
}
