export namespace Constants {

  export enum Symbol {
    DOLLAR_SIGN = '$',
    FORWARD_SLASH = '/'
  }

  export enum Route {
    LOGIN = "login",
    CONTRIBUTE = "contribute",
    HOME = "",
    TOP_LYRICS = "toplyrics",
    ADD_ARTIST = "contribute/add-artist",
    ADD_ALBUM = "contribute/add-album",
    LYRICS_VIEW = "feedItem/:artist/:song",
    ABOUT = "about",
    WILDCARD = "**"
  }

  export enum FormFieldConstants {
    NAME, EMAIL, PASSWORD
  }

  export interface ItemSuggest {
    name: string
  }

  export interface SuggestedItem {
    surrogateKey: string,
    name: string
  }

  export interface AlbumSuggest {
    surrogateKey: string,
    albumName: string
  }

  export interface ArtistSuggest {
    surrogateKey: string,
    artistName: string
  }

}
