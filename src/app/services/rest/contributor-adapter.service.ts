import {Injectable} from '@angular/core';
import {RestTemplateBuilder} from './rest-template-builder';
import {BasicHttpResponse} from '../../dto/base-http-response';
import {first, map, share} from 'rxjs/operators';
import {HttpRoot} from './http-root';
import {Constants} from '../../constants/constants';
import {ContributorResponseData} from '../../dto/contributor';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContributorAdapterService extends HttpRoot {

  constructor() {
    super();
  }

  public requestContributorDetails(): Observable<ContributorResponseData> {

    let observable: Observable<ContributorResponseData>;

    const contributorDetails = sessionStorage.getItem(Constants.Session.CONTRIBUTOR_OBJ);

    if (contributorDetails !== null) {
      observable = of<ContributorResponseData>(<ContributorResponseData>JSON.parse(contributorDetails)).pipe(first(), share());
    } else {
      observable = (new RestTemplateBuilder())
        .withAuthHeader()
        .get<BasicHttpResponse>(this.GET_CONTRIBUTOR_URL)
        .pipe(first(), share(), map(response => response.body.data));

      observable.subscribe((res) => {
        sessionStorage.setItem(Constants.Session.CONTRIBUTOR_OBJ, JSON.stringify(res));
      }, error => {
        console.error('Error requesting details of contributor.', error);
      });
    }

    return observable;
  }
}
