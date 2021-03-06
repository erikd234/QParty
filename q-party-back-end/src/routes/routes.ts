import axios from "axios";
import { Request, Response } from "express";
import SpeakerRequest from "../requests/SpeakerRequest";
import SpotifyActionRequest from "../requests/SpotifyActionRequest";
import SpotifyAuthRequest from "../requests/SpotifyAuthRequest";
import Song from "../types/Song";

export const setRoutes = (app: any, io: any) => {
  app.get("/login", SpotifyAuthRequest.spotifyLogin);

  app.get("/callback", SpotifyAuthRequest.obtainRequestAndAccessTokens);

  /**
   * When the refress token is stored we can skip the login and get a new access token from a refresh token
   */
  app.get("/getnewtoken", SpotifyAuthRequest.obatinNewRefreshToken);

  app.get("/search", SpotifyActionRequest.performSpotifySearch);

  app.get("/play/:uri", SpeakerRequest.playSongRequest);
  app.get("/getspeakers", SpeakerRequest.getAvailableDevicesRequest);
  app.get("/addspeaker/:roomname", SpeakerRequest.addSpeakerToPlayGroupRequest);
  app.get("/removespeaker/:roomname", SpeakerRequest.removeSpeakerFromPlayGroupRequest);
  app.post("/sonoswebhookevent", (req: Request, res: Response) => {
    SpeakerRequest.onSonosWebHookEventRequest(req, res, io);
  });
  app.get("/currentsong", SpeakerRequest.getCurrentSongRequest);
};
