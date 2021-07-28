export interface SpeakerZone {
  uuid: string;
  coordinator: Coordinator;
  members: Coordinator[];
}

interface Coordinator {
  uuid: string;
  state: State;
  roomName: string;
  coordinator: string;
  groupState: GroupState;
}

interface State {
  volume: number;
  mute: boolean;
  currentTrack: CurrentTrack;
  playbackState: string;
  playMode: PlayMode;
}

interface GroupState {
  volume: number;
  mute: boolean;
}
