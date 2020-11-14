import {Injectable} from '@angular/core';
import {HttpRoot} from './http-root';
import {RestTemplateBuilder} from './rest-template-builder';
import {HttpClient} from '@angular/common/http';
import {Constants} from '../../constants/constants';
import {first, map, tap} from 'rxjs/operators';
import AllGenre = Constants.AllGenre;
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenreAdapterService extends HttpRoot {

  public allGenre: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(private http: HttpClient) {
    super();
  }

  getAllGenres(): void {
    if (this.allGenre.getValue().length <= 0) {
      (new RestTemplateBuilder())
        .withAuthHeader()
        .get<AllGenre>(this.GET_ALL_GENRE_URL)
        .pipe(
          map(payload => payload.data),
          map(payload => payload.map(x => x.genreName + '$' + x.id)),
          tap(payload => this.allGenre.next(payload)),
          first())
        .subscribe(v => '', e => console.log('error'));
    }
  }
}
