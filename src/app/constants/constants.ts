export namespace Constants {

  export const DOLLAR_SIGN = '$';

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
