import { Coordinator, SpeakerZone } from "./../types/SpeakerService.d";
import axios, { AxiosRequestConfig } from "axios";
import Info from "../public/Info";
import { response } from "express";
import Speaker from "../types/Speaker";
import Song, { QueueElement } from "../types/Song";

export default class SpeakerService {
  static baseUrl: string = "http://localhost:5005";

  static async playSongOnSpeakers(uri: any) {
    // returns false if no group memebers
    const validRoomName = SpeakerService.getValidPlayMember();
    if (!validRoomName) return { data: "no speakers selected" };

    const url = this.baseUrl + `/${validRoomName}/spotify/now/${uri}`;
    const options: AxiosRequestConfig = {
      url: url,
    };
    return await axios(options);
  }

  /**
   * sets the global variable for available devices in Info.User.availableSpeakers as an array of objects for return
   * and returns the available devices
   */
  static async getAvailableDevices() {
    let options: AxiosRequestConfig = {
      url: this.baseUrl + `/zones/`,
    };
    const me = this;
    return axios(options)
      .then(function (response) {
        const speakerZoneList: SpeakerZone[] = response.data;
        const availabeSpeakers = me.findSpeakers(speakerZoneList);
        return availabeSpeakers;
      })
      .catch(function (err) {
        console.log("Could not get available devices");
      });
  }

  /**
   * Find all the speaker zones in a list of speaker zones (recursive)
   */
  static findSpeakers(speakerZoneList: SpeakerZone[]) {
    let availableSpeakers: Speaker[] = [];
    let seenSpeakers: any = {};
    let memberQueue: Coordinator[][] = []; // members to visit
    const me = this;

    for (const speakerZone of speakerZoneList) {
      const roomName = speakerZone.coordinator.roomName;
      // keep note of the ones we have seen so we dont have duplicates
      seenSpeakers[roomName] = true;
      const members = speakerZone.members;
      // make a list of all the Speaker zones that are in a group. (have more than one sub member)
      if (speakerZone.members.length !== 1) memberQueue.push(members);
      const availableSpeaker = {
        roomName: roomName,
        uuid: speakerZone.uuid,
        isPlaying: speakerZone.coordinator.state.playbackState === "PLAYING",
        isInPlayGroup: me.isRoomInPlayGroup(roomName),
      };
      availableSpeakers.push(availableSpeaker);
    }

    // next step gather all sub speakers while zones are enQueue

    while (memberQueue.length) {
      const nextCoordinatorList = memberQueue.shift();
      for (const speakerCoordinator of nextCoordinatorList as Coordinator[]) {
        const roomName = speakerCoordinator.roomName;
        // dont duplicate
        if (seenSpeakers[roomName]) continue;

        const availableSpeaker = {
          roomName: roomName,
          uuid: speakerCoordinator.uuid,
          isPlaying: speakerCoordinator.state.playbackState === "PLAYING",
          isInPlayGroup: me.isRoomInPlayGroup(roomName),
        };
        availableSpeakers.push(availableSpeaker);
      }
    }
    return availableSpeakers;
  }

  static isRoomInPlayGroup(roomName: String) {
    const playGroup: any = Info.User.getCurrentPlayGroup();
    return playGroup.hasOwnProperty(roomName);
  }

  static getValidPlayMember() {
    return Info.User.getPlayGroupMember();
  }
  static async addToPlayGroup(roomName: string) {
    const playGroup: any = Info.User.getCurrentPlayGroup();
    const speakers = Object.keys(playGroup);
    // if none in playgroup no need to create a new group
    // add it to the list
    if (speakers.length === 0) {
      Info.User.addToPlayGroup(roomName);
      return { data: "no group formed yet " + roomName + " is alone." };
    }
    Info.User.addToPlayGroup(roomName);
    const baseSpeaker = Info.User.getPlayGroupMember();
    const options = {
      url: this.baseUrl + `/${roomName}/join/${baseSpeaker}`,
    };
    const response = await axios(options);
    return response.data;
  }

  /**
   *
   * @param roomName name of the room stored in the groups
   * @returns data or message object
   */
  static async removeFromPlayGroup(roomName: string) {
    if (Info.User.removeFromPlayGroup(roomName)) {
      const options = {
        url: this.baseUrl + `/${roomName}/leave`,
      };
      const response = await axios(options);
      return response.data;
    }
    return { data: "Room was not in play group could not remove." };
  }
  /**
   * Initialize group list to be an empty list and isolate all speakers
   */
  static async initGroupList() {
    // isolate all speakers
    let speakers: void | { roomName: string; uuid: string; isPlaying: boolean }[] = [];
    try {
      speakers = await this.getAvailableDevices();
    } catch (err) {
      console.log("Could not get availabe devices");
    }

    for (let speaker of speakers as Array<any>) {
      let options = {
        url: this.baseUrl + `/${speaker.roomName}/isolate`,
      };
      let response = await axios(options);
      if (response.data) {
        console.log(speaker.roomName + " isolated");
      }
    }
  }

  static async addToQueue(trackUri: any) {
    const groupSpeaker = this.getValidPlayMember();
    if (!groupSpeaker) return false;
    const options = {
      url: `http://localhost:5005/${groupSpeaker}/spotify/queue/${trackUri}`,
    };
    const response = await axios(options);
    const success = response.data;
    return success;
  }

  static async getQueue() {
    const groupSpeaker = this.getValidPlayMember();
    if (!groupSpeaker) return false;
    const options = {
      url: `http://localhost:5005/${groupSpeaker}/queue/detailed`,
    };
    const response = await axios(options);
    const queue = response.data.map((song: QueueElement) => {
      const newSong: Song = {
        trackUri: song.uri.split(":")[1],
        trackArtist: song.artist,
        trackName: song.title,
      };
      return newSong;
    });
    return queue;
  }

  static async getCurrentSong() {
    const groupSpeaker = this.getValidPlayMember();
    if (!groupSpeaker) return false;
    const options = {
      url: `http://localhost:5005/${groupSpeaker}/state`,
    };
    const response = await axios(options); //TODO add error handling
    return {
      trackArtist: response.data.currentTrack.artist,
      trackName: response.data.currentTrack.title,
      trackUri: response.data.currentTrack.artist,
    };
  }
  /**
   * Clears the built in sonos queue that causes issues with the queue I am creating
   */
  static async clearPlayGroupBuiltInQueue() {
    let groupSpeaker = this.getValidPlayMember();
    if (!groupSpeaker) {
      // now I want to clean every speakers queue eventually for now just group speaker
      groupSpeaker = "kitchen"; //TODO change this to iterate through all speakers queue;
    }
    const options = {
      url: `http://localhost:5005/${groupSpeaker}/clearqueue`,
    };
    const response = await axios(options); //TODO add error handling
    console.log("clear queue returned" + response.data);
  }
}
/**
 * Adds the speaker to the list on the server of
 */
