import {Observable, of} from 'rxjs';
import {first, map, share} from 'rxjs/operators';
import {RestTemplateBuilder} from './rest-template-builder';
import {HttpRoot} from './http-root';
import {Constants} from '../../constants/constants';
import {UtilService} from '../util.service';
import AppConstant = Constants.AppConstant;

export abstract class GenericAdapter<GetResponse, SaveRequest, SaveResponse, SearchResponse> extends HttpRoot {

  private objectMap: Map<string, GetResponse> = new Map();

  protected constructor() {
    super();
  }

  /**
   * Get objects by surrogate key. If it was already fetched before then get it from the objectMap
   * @param url url of the API call
   * @param surrogateKey surrogate key
   * @param doRefresh do need to explicitly fetch from the API or not
   */
  protected getObjectBySurrogateKey(url: string, surrogateKey: string, doRefresh: boolean): Observable<GetResponse> {
    let observable: Observable<GetResponse>;
    if (!doRefresh && this.objectMap.size > 0 && !!this.objectMap.get(surrogateKey)) {
      observable = of<GetResponse>(this.objectMap.get(surrogateKey)).pipe(share());
    } else {
      observable = (new RestTemplateBuilder())
        .withParam(Constants.Param.SURROGATE_KEY, surrogateKey)
        .get<GetResponse>(url)
        .pipe(
          map(response => response.body),
          share());

      observable.subscribe(value => this.objectMap.set(surrogateKey, value));
    }

    return observable;
  }

  protected saveObject(url: string, payload: SaveRequest, image: Blob = null): Observable<SaveResponse> {
    const formData: FormData = new FormData();
    formData.append(AppConstant.PAYLOAD, UtilService.dataToBlob(payload));

    if (image) {
      formData.append(AppConstant.IMAGE, image);
    }

    return (new RestTemplateBuilder())
      .withAuthHeader()
      .post<FormData, SaveResponse>(url, formData)
      .pipe(
        map(response => response.body),
        first(),
        share());
  }

  public searchPageable(url: string, query: string, pageNumber: number, pageSize: number): Observable<SearchResponse> {
    return (new RestTemplateBuilder())
      .withParam(Constants.Param.QUERY, query)
      .withParam(Constants.Param.PAGE_NUMBER, pageNumber.toString())
      .withParam(Constants.Param.PAGE_SIZE, pageSize.toString())
      .get<SearchResponse>(url)
      .pipe(
        map(response => response.body),
        first(),
        share());
  }
}
