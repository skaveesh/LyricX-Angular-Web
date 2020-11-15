export namespace Constants {

  export enum AppConstant {
    CONTENT_TYPE = 'Content-Type',
    APPLICATION_JSON = 'application/json',
    AUTHORIZATION = 'Authorization',
    BEARER = 'Bearer',
    ARTIST = 'Artist',
    ALBUM = 'Album',
  }

  export enum Assert {
    ARTIST_IMAGE = '/assets/artist_image.png'
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

}
