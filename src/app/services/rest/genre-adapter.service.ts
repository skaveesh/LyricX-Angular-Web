import {Injectable} from '@angular/core';
import {RestTemplateBuilder} from './rest-template-builder';
import {filter, first, map, take, tap} from 'rxjs/operators';
import {AllGenre} from '../../dto/genre';
import {StaticSelectionAdapter} from './static-selection-adapter';
import {UserAuthorizationService} from '../auth/user-authorization.service';

@Injectable({
  providedIn: 'root'
})
export class GenreAdapterService extends StaticSelectionAdapter {

  private isAlreadyBeenCalled = false;

  constructor(private authService: UserAuthorizationService) {
    super();
  }

  getAllSelections(): void {
    this.authService.isLoggedOut.pipe(filter(res => res !== null), take(1)).toPromise().then(res => {

      if (!res) {

        if (!this.isAlreadyBeenCalled && this.allSelections.getValue().length <= 0) {

          this.isAlreadyBeenCalled = true;

          (new RestTemplateBuilder())
            .withAuthHeader()
            .get<AllGenre>(this.GET_ALL_GENRE_URL)
            .pipe(
              map(payload => payload.body),
              map(payload => payload.data),
              map(payload => payload.map(x => x.genreName + '$' + x.id)),
              tap(payload => this.allSelections.next(payload)),
              first())
            .subscribe(v => '',
              e => {
                throw new Error('Couldn\'t fetch Genres');
              });
        }
      }
    }).catch(() => console.error('Error fetching Genres'));
  }

}
