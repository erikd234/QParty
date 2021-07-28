import axios, { AxiosRequestConfig } from "axios";
import { Request, Response } from "express";
import Info from "../public/Info";
import querystring from "query-string";

export default class SpotifyAuthService {
  static getAuthCredentials() {
    const creds = {
      scope: Info.Application.getScope(),
      clientId: Info.Application.getClientId(),
      redirectUri: Info.Application.getRedirectUri(),
      clientSecret: Info.Application.getClientSecret(),
      refreshToken: Info.User.getRefreshToken(),
    };
    return creds;
  }

  static getAccessToken() {
    return Info.User.getAccessToken();
  }
}
