export interface ArtistSuggest {
  surrogateKey: string;
  artistName: string;
}

export interface ArtistCreateRequest {
  name: string;
  genreIdList: number[];
}
