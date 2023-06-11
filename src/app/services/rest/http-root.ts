export class HttpRoot {
  private readonly ROOT_URL = 'http://localhost:8000/';

  readonly GET_METADATA = this.ROOT_URL + 'metadata';
  readonly GET_ALL_GENRE_URL = this.ROOT_URL + 'genre/all';
  readonly GET_ALL_LANGUAGE_URL = this.ROOT_URL + 'language/all';

  readonly GET_ARTIST_URL = this.ROOT_URL + 'artist/get';
  readonly SEARCH_ARTIST_URL = this.ROOT_URL + 'artist/search';
  readonly SAVE_ARTIST_URL = this.ROOT_URL + 'artist/save';

  readonly GET_ALBUM_URL = this.ROOT_URL + 'album/get';
  readonly SEARCH_ALBUM_URL = this.ROOT_URL + 'album/search';
  readonly SAVE_ALBUM_URL = this.ROOT_URL + 'album/save';

  readonly GET_SONG_URL = this.ROOT_URL + 'song/get';
  readonly SEARCH_SONG_URL = this.ROOT_URL + 'song/search';
  readonly SAVE_SONG_URL = this.ROOT_URL + 'song/save';

  readonly GET_CONTRIBUTOR_URL = this.ROOT_URL + 'contributor/get';
  readonly GET_MY_CONTRIBUTIONS_URL = this.ROOT_URL + 'song/get/contributor';

}
