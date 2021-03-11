import {Injectable} from '@angular/core';
import {HttpRoot} from './http-root';
import {RestTemplateBuilder} from './rest-template-builder';
import {first, map, tap} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {AllGenre} from '../../dto/genre';
import {HttpResponse} from '@angular/common/http';
import {UtilService} from '../util.service';

@Injectable({
  providedIn: 'root'
})
export class GenreAdapterService extends HttpRoot {

  public allGenre: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor() {
    super();
  }

  getAllGenres(): void {
    if (this.allGenre.getValue().length <= 0) {
      (new RestTemplateBuilder())
        .withAuthHeader()
        .get<AllGenre>(this.GET_ALL_GENRE_URL)
        .pipe(
          map(payload => payload.body),
          map(payload => payload.data),
          map(payload => payload.map(x => x.genreName + '$' + x.id)),
          tap(payload => this.allGenre.next(payload)),
          first())
        .subscribe(v => '',
            e => {
          console.log(e);
          throw new Error('Couldn\'t fetch Genres');
        });
    }
  }
}
