export interface AlbumSuggest {
  surrogateKey: string;
  albumName: string;
}

export interface AlbumCreateRequest {
  name: string;
  artistSurrogateKey: string;
  year: number;
}
