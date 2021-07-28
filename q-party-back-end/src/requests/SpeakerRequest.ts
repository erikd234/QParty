import axios, { AxiosRequestConfig } from "axios";
import { Request, Response } from "express";
import SpeakerService from "../service/SpeakerService";

export default class SpeakerRequest {
  static baseUrl: string = "http://localhost:5005";

  static async getAvailableDevicesRequest(req: Request, res: Response) {
    const data = await SpeakerService.getAvailableDevices();
    res.json(data);
  }

  static playSongRequest(req: Request, res: Response) {
    let uri = req.params.uri;

    // returns false if no group memebers
    const validRoomName = SpeakerService.getValidPlayMember();
    if (!validRoomName) {
      res.json({ message: "no speakers selected" });
      return;
    }
    const url = SpeakerRequest.baseUrl + `/${validRoomName}/spotify/now/${uri}`;
    const options: AxiosRequestConfig = {
      url: url,
    };
    axios(options)
      .then(function (response) {
        res.json(response);
      })
      .catch(function (err) {
        res.json(err);
      });
  }
  static async addSpeakerToPlayGroupRequest(req: Request, res: Response) {
    const roomName = req.params.roomname;
    const response = await SpeakerService.addToPlayGroup(roomName);
    res.json(response.data);
  }
  static async removeSpeakerFromPlayGroupRequest(req: Request, res: Response) {
    const roomName = req.params.roomname;
    const response = await SpeakerService.removeFromPlayGroup(roomName);
    res.json(response.data);
  }
  static async getCurrentSongRequest(req: Request, res: Response) {
    const currentSong = await SpeakerService.getCurrentSong();
    if (!currentSong) return res.json("No Speaker Selected");
    res.json(currentSong);
  }
}
