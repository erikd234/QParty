import Song from "../types/Song";
/**
 * Name space for user session information
 * Eventually this file will communicate with the database for specific user information based on some auth.
 */
const User = {
  refreshToken: process.env.REFRESH_TOKEN,
  accessToken: "",
  /**
   * This list contains the name of the rooms that are currently playing.
   */
  currentPlayGroup: {},
  getCurrentPlayGroup() {
    return this.currentPlayGroup;
  },
  addToPlayGroup(roomName: string) {
    // add a speaker to the playGroup
    const group: any = this.currentPlayGroup;
    group[roomName] = true;
    return true;
  },
  removeFromPlayGroup(roomName: string) {
    if (!this.currentPlayGroup.hasOwnProperty(roomName)) return false;
    const group: any = this.currentPlayGroup;
    delete group[roomName];
    return true;
  },
  /**
   * Gets a valid group member if there is one for playback.
   */
  getPlayGroupMember() {
    const group: any = this.currentPlayGroup;
    const keys = Object.keys(group);
    if (keys.length === 0) return false;
    return keys[0];
  },
  getRefreshToken: function () {
    return this.refreshToken;
  },
  getAccessToken: function () {
    if (this.accessToken === "") return false;
    return this.accessToken;
  },
  setRefreshToken: function (token: any) {
    this.refreshToken = token;
  },
  setAccessToken: function (token: any) {
    this.accessToken = token;
  },
};

const Application = {
  songQueue: {
    _queue: [] as Song[],
    getQueue: function () {
      return this._queue;
    },
    addQueue: function (song: Song) {
      this._queue.push(song);
    },
    getNext: function () {
      return this._queue.shift();
    },
    removeById: function (songUri: string) {
      this._queue = this._queue.filter((song) => {
        songUri !== song.trackUri;
      });
    },
  },
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
  scope:
    "user-read-private user-read-email " +
    "user-modify-playback-state " +
    "user-read-currently-playing " +
    "user-read-playback-state",
  getClientId: function () {
    return this.clientId;
  },
  getClientSecret: function () {
    return this.clientSecret;
  },
  getRedirectUri: function () {
    return this.redirectUri;
  },
  getScope: function () {
    return this.scope;
  },
  setClientId: function (clientId: any) {
    this.clientId = clientId;
  },
  setClientSecret: function (clientSecret: any) {
    this.clientSecret = clientSecret;
  },
  setRedirectUri: function (redirectUri: any) {
    this.redirectUri = redirectUri;
  },
};

export default class Info {
  static User = User;
  static Application = Application;
}
