import {Injectable} from '@angular/core';
import {RestTemplateBuilder} from './rest-template-builder';
import {filter, first, flatMap, map, share, take, tap} from 'rxjs/operators';
import {AllGenre} from '../../dto/genre';
import {StaticSelectionAdapter} from './static-selection-adapter';
import {UserAuthorizationService} from '../auth/user-authorization.service';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenreAdapterService extends StaticSelectionAdapter {

  private isAlreadyBeenCalled = false;

  constructor(private authService: UserAuthorizationService) {
    super();
  }

  public getAllSelections(): Observable<string[]> {
    return this.authService.isLoggedOut.pipe(filter(res => res !== null), take(1), flatMap(res => {

      let observable: Observable<string[]>;

      if (!res && !this.isAlreadyBeenCalled && this.allSelections.getValue().length <= 0) {
        observable = (new RestTemplateBuilder())
          .withAuthHeader()
          .get<AllGenre>(this.GET_ALL_GENRE_URL)
          .pipe(
            map(payload => payload.body),
            map(payload => payload.data),
            map(payload => payload.map(x => x.genreName + '$' + x.id)),
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
          throw new Error('Couldn\'t fetch Genre');
        });

      return observable;
    }));
  }

  public initializeGenre(genreIdList: number[], genreNameList: string[]): void {
    this.getAllSelections().subscribe(() => {
      genreNameList.splice(0);
      this.allSelections.pipe(
        take(this.allSelections.getValue().length <= 0 ? 2 : 1)
      ).subscribe(value => {
        const genreIdStringList = genreIdList.map(String);
        if (value.length > 0) {
          value.forEach(genreItem => {
            genreIdStringList.forEach(genreIdItem => {
              if (genreItem.substring(genreItem.lastIndexOf('$') + 1) === genreIdItem) {
                genreNameList.push(genreItem.substring(0, genreItem.lastIndexOf('$')));
                genreIdStringList.splice(genreIdStringList.indexOf(genreIdItem), 1);
              }
            });
          });
        }
      }, error => {
        console.error(error);
        throw new Error('Error while fetching Genre');
      });
    });
  }
}
