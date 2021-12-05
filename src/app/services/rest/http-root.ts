export class HttpRoot {
  private readonly ROOT_URL = 'http://localhost:8000/';

  readonly GET_METADATA = this.ROOT_URL + 'metadata';
  readonly GET_ALL_GENRE_URL = this.ROOT_URL + 'genre/all';
  readonly GET_ALL_LANGUAGE_URL = this.ROOT_URL + 'language/all';

  readonly GET_ARTIST_URL = this.ROOT_URL + 'artist/get';
  readonly CREATE_ARTIST_URL = this.ROOT_URL + 'artist/create';

  readonly GET_ALBUM_URL = this.ROOT_URL + 'album/get';
  readonly CREATE_ALBUM_URL = this.ROOT_URL + 'album/create';
  readonly SAVE_SONG_DETAILS_URL = this.ROOT_URL + 'song/save/details';
  readonly SAVE_SONG_ALBUMART_URL = this.ROOT_URL + 'song/save/albumart';

  readonly GET_CONTRIBUTOR_URL = this.ROOT_URL + 'contributor/get';
  readonly GET_MY_CONTRIBUTIONS_URL = this.ROOT_URL + 'song/get/contributor';

}
