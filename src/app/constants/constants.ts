export namespace Constants {

  export enum AppConstant {
    CONTENT_TYPE = 'Content-Type',
    APPLICATION_JSON = 'application/json',
    AUTHORIZATION = 'Authorization',
    BEARER = 'Bearer'
  }

  export enum Error {
    USER_TOKEN_NOT_FOUNT = 'User token not found.'
  }

  export enum Symbol {
    DOLLAR_SIGN = '$',
    FORWARD_SLASH = '/',
    WHITESPACE = ' '
  }

  export enum Route {
    LOGIN = 'login',
    CONTRIBUTE = 'contribute',
    HOME = '',
    TOP_LYRICS = 'toplyrics',
    ADD_ARTIST = 'contribute/add-artist',
    ADD_ALBUM = 'contribute/add-album',
    LYRICS_VIEW = 'feedItem/:artist/:song',
    ABOUT = 'about',
    WILDCARD = '**'
  }

  export enum Session {
    USER_TOKEN = 'userToken',
    AFTER_LOGIN_PATH_KEY = 'afterLoginPathKey'
  }

  export enum FormFieldConstants {
    NAME, EMAIL, PASSWORD
  }

  export interface ItemSuggest {
    name: string;
  }

  export interface SuggestedItem {
    surrogateKey: string;
    name: string;
  }

  export interface AlbumSuggest {
    surrogateKey: string;
    albumName: string;
  }

  export interface ArtistSuggest {
    surrogateKey: string;
    artistName: string;
  }

  interface BaseHttpResponse {
    'timestamp': string;
    'message': string;
    'errorCode': string;
  }

  interface Genre {
    'id': number;
    'genreName': string;
    'addedDate': string;
    'lastModifiedDate': string;
  }

  interface GenreList {
    'data': Genre[];
  }

  export type AllGenre = BaseHttpResponse & GenreList;

}
