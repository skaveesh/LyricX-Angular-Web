export namespace Constants {
  export enum FormFieldConstants {
    NAME, EMAIL, PASSWORD
  }

  export interface AlbumSuggest {
    albumName : string
  }

  export interface AlbumSuggestedItem {
    surrogateKey: string,
    albumName: string
  }
}
