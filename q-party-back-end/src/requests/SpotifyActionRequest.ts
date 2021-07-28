import axios, { AxiosRequestConfig } from "axios";
import { Request, Response } from "express";
import SpotifyAuthService from "../service/SpotifyAuthService";

export default class SpotifyActionRequest {
  static performSpotifySearch(req: Request, res: Response) {
    let query = req.query.q;
    const accessToken = SpotifyAuthService.getAccessToken();
    if (!accessToken) {
      res.json("invalid AccessToken");
      return;
    }
    let options: AxiosRequestConfig = {
      url: "https://api.spotify.com/v1/search",
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      params: {
        q: query,
        type: "track",
      },
    };
    axios(options)
      .then((response) => {
        if (response.status !== 200) {
          res.json("Invalid Request code: " + response.status);
          return;
        }
        res.json(response.data);
      })
      .catch((error) => {
        res.json(error);
      });
  }
}
