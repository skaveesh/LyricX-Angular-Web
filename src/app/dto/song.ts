export interface SongSaveRequest {
  surrogateKey: string;
  name: string;
  albumSurrogateKey: string;
  guitarKey: string;
  beat: string;
  languageCode: string;
  keywords: string;
  lyrics: string;
  youTubeLink: string;
  spotifyLink: string;
  deezerLink: string;
  isExplicit: boolean;
  artistSurrogateKeyList: string[];
  genreIdList: number[];
}
