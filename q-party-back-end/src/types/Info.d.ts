export interface User {
  refreshToken: string | undefined;
  accessToken: string;
  /**
   * This list contains the name of the rooms that are currently playing.
   */
  currentSpeakers: Array<string>;
  availableSpeakers: Array<string>;
  setAvailableSpeakers;
}
