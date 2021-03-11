import {BaseHttpResponse} from './base-http-response';

interface Genre {
  'id': number;
  'genreName': string;
  'addedDate': string;
  'lastModifiedDate': string;
}

interface GenreList {
  'data': Genre[];
}

export type AllGenre = BaseHttpResponse & GenreList;
