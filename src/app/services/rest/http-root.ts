export class HttpRoot {
  private readonly ROOT_URL = 'http://localhost:8000/';

  readonly GET_METADATA = this.ROOT_URL + 'metadata';
  readonly GET_ALL_GENRE_URL = this.ROOT_URL + 'genre/all';
  readonly GET_ALL_LANGUAGE_URL = this.ROOT_URL + 'language/all';
  readonly CREATE_ARTIST_URL = this.ROOT_URL + 'artist/create';
  readonly CREATE_ALBUM_URL = this.ROOT_URL + 'album/create';
}
