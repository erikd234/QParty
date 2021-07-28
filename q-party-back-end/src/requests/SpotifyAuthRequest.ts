import axios, { AxiosRequestConfig } from "axios";
import { Request, Response } from "express";
import Info from "../public/Info";
import querystring from "query-string";
import SpotifyAuthService from "../service/SpotifyAuthService";

export default class SpotifyAuthRequest {
  static obtainRequestAndAccessTokens(req: Request, res: Response) {
    // your application requests refresh and access tokens
    // after checking the state parameter
    const code: any = req.query.code;
    if (code == null) return;

    const { clientId, clientSecret, redirectUri } = SpotifyAuthService.getAuthCredentials();

    const buff = Buffer.from(clientId + ":" + clientSecret, "utf-8");
    const authInformation = buff.toString("base64");

    let options: AxiosRequestConfig = {
      url: "https://accounts.spotify.com/api/token",
      method: "POST",
      headers: {
        // 'Content-Type':'application/x-www-form-urlencoded',
        Authorization: "Basic " + authInformation,
      },
      params: {
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code: code,
      },
    };
    axios(options)
      .then(function (response) {
        res.json("Success");
      })
      .catch(function (error) {
        res.json("Failure");
      });
  }

  static spotifyLogin(req: Request, res: Response) {
    // your application requests authorization
    const { scope, clientId, redirectUri } = SpotifyAuthService.getAuthCredentials();
    res.redirect(
      "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          response_type: "code",
          client_id: clientId,
          scope: scope,
          redirect_uri: redirectUri,
        })
    );
  }
  static obatinNewRefreshToken(req: Request, res: Response) {
    const { clientId, clientSecret, refreshToken } = SpotifyAuthService.getAuthCredentials();

    const buff = Buffer.from(clientId + ":" + clientSecret, "utf-8");
    const authInformation = buff.toString("base64");

    let options: AxiosRequestConfig = {
      url: "https://accounts.spotify.com/api/token",
      method: "POST",
      headers: {
        // 'Content-Type':'application/x-www-form-urlencoded',
        Authorization: "Basic " + authInformation,
      },
      params: {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      },
    };
    axios(options)
      .then(function (response) {
        Info.User.setAccessToken(response.data.access_token);
        res.json("Success");
      })
      .catch(function (error) {
        res.json("Failure");
      });
  }
}
