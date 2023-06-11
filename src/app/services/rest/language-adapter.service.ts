import {Injectable} from '@angular/core';
import {RestTemplateBuilder} from './rest-template-builder';
import {filter, first, flatMap, map, share, take, tap} from 'rxjs/operators';
import {AllLanguage} from '../../dto/language';
import {StaticSelectionAdapter} from './static-selection-adapter';
import {UserAuthorizationService} from '../auth/user-authorization.service';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageAdapterService extends StaticSelectionAdapter {

  private isAlreadyBeenCalled = false;

  constructor(private authService: UserAuthorizationService) {
    super();
  }

  getAllSelections(): Observable<string[]> {
    return this.authService.isLoggedOut.pipe(filter(res => res !== null), take(1), flatMap(res => {

      let observable: Observable<string[]>;

      if (!res && !this.isAlreadyBeenCalled && this.allSelections.getValue().length <= 0) {
      observable = (new RestTemplateBuilder())
        .withAuthHeader()
        .get<AllLanguage>(this.GET_ALL_LANGUAGE_URL)
        .pipe(
          map(payload => payload.body),
          map(payload => payload.data),
          map(payload => payload.map(x => x.languageName + '$' + x.languageCode)),
          tap(payload => {
            this.isAlreadyBeenCalled = true;
            this.allSelections.next(payload);
          }),
          first(),
          share());
      } else {
        observable = of<string[]>(this.allSelections.value).pipe(share());
      }

      observable.subscribe(() => '',
        e => {
          throw new Error('Couldn\'t fetch Languages');
        });

      return observable;
    }));
  }

}
