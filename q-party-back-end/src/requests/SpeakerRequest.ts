import axios, { AxiosRequestConfig } from "axios";
import { info } from "console";
import { Request, Response } from "express";
import Info from "../public/Info";
import SpeakerService from "../service/SpeakerService";
import Song from "../types/Song";

export default class SpeakerRequest {
  static baseUrl: string = "http://localhost:5005";

  static async getAvailableDevicesRequest(req: Request, res: Response) {
    const data = await SpeakerService.getAvailableDevices();
    res.json(data);
  }

  static async playSongRequest(req: Request, res: Response) {
    let uri = req.params.uri;
    const response = await SpeakerService.playSongOnSpeakers(uri);
    res.json(response.data);
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
