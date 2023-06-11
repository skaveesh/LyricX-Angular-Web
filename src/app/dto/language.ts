import {BaseHttpResponse} from './base-http-response';

interface Language {
  'id': number;
  'languageName': string;
  'languageCode': string;
}

interface LanguageList {
  'data': Language[];
}

export type AllLanguage = BaseHttpResponse & LanguageList;
