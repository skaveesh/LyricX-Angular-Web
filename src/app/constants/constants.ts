export namespace Constants {

  export enum AppConstant {
    CONTENT_TYPE = 'Content-Type',
    APPLICATION_JSON = 'application/json',
    MULTIPART_FORM_DATA = 'multipart/form-data',
    AUTHORIZATION = 'Authorization',
    RESPONSE = 'response',
    BEARER = 'Bearer',
    ARTIST = 'Artist',
    ALBUM = 'Album',
    BASE64 = 'base64',
    PAYLOAD = 'payload',
    IMAGE = 'image'
  }

  export enum Param {
    SURROGATE_KEY = 'surrogateKey',
    PAGE_NUMBER = 'pageNumber',
    PAGE_SIZE = 'pageSize'
  }

  export enum Asset {
    ARTIST_IMAGE = '/assets/images/artist_image.png',
    ALBUM_IMAGE = '/assets/images/album_image.png'
  }

  export enum Error {
    USER_TOKEN_NOT_FOUNT = 'User token not found.'
  }

  export enum Symbol {
    DOLLAR_SIGN = '$',
    FORWARD_SLASH = '/',
    WHITESPACE = ' ',
    COMMA = ',',
    COLON = ':',
    SEMI_COLON = ';'
  }

  export enum Route {
    LOGIN = 'login',
    CONTRIBUTE = 'contribute',
    HOME = '',
    TOP_LYRICS = 'toplyrics',
    ADD_ARTIST = 'contribute/add-artist',
    ADD_ALBUM = 'contribute/add-album',
    ITEM_VIEW = ':item/:item-surrogate-key',
    ABOUT = 'about',
    ERROR = 'error',
    WILDCARD = '**',
    SONG = 'song',
    ARTIST = 'artist'
  }

  export enum Session {
    USER_TOKEN = 'userToken',
    AFTER_LOGIN_PATH_KEY = 'afterLoginPathKey',
    SONG_LYRIC = 'songLyric',
    CONTRIBUTOR_OBJ = 'contributorObj'
  }

  export enum FormFieldConstants {
    NAME, EMAIL, PASSWORD
  }

}
