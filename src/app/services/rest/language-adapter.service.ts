import {Injectable} from '@angular/core';
import {RestTemplateBuilder} from './rest-template-builder';
import {first, map, tap} from 'rxjs/operators';
import {AllLanguage} from '../../dto/language';
import {StaticSelectionAdapter} from './static-selection-adapter';

@Injectable({
  providedIn: 'root'
})
export class LanguageAdapterService extends StaticSelectionAdapter {

  constructor() {
    super();
  }

  getAllSelections(): void {
    if (this.allSelections.getValue().length <= 0) {
      (new RestTemplateBuilder())
        .withAuthHeader()
        .get<AllLanguage>(this.GET_ALL_LANGUAGE_URL)
        .pipe(
          map(payload => payload.body),
          map(payload => payload.data),
          map(payload => payload.map(x => x.languageName + '$' + x.languageCode)),
          tap(payload => this.allSelections.next(payload)),
          first())
        .subscribe(v => '',
          e => {
            console.log(e);
            throw new Error('Couldn\'t fetch Languages');
          });
    }
  }

}
