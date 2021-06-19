import {Observable, of} from 'rxjs';
import {first, map, share} from 'rxjs/operators';
import {RestTemplateBuilder} from './rest-template-builder';
import {HttpRoot} from './http-root';
import {Constants} from '../../constants/constants';
import {UtilService} from '../util.service';
import AppConstant = Constants.AppConstant;

export abstract class GenericAdapter<GetResponse, CreateRequest, CreateResponse> extends HttpRoot {

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
  public getObjectBySurrogateKey(url: string, surrogateKey: string, doRefresh: boolean): Observable<GetResponse> {
    let observable: Observable<GetResponse>;

    if (!doRefresh && this.objectMap.size > 0 && this.objectMap.get(surrogateKey) !== null) {
      observable = of<GetResponse>(this.objectMap.get(surrogateKey)).pipe(first(), share());
    } else {
      observable = (new RestTemplateBuilder())
        .withAuthHeader()
        .withParam(Constants.Param.SURROGATE_KEY, surrogateKey)
        .get<GetResponse>(url)
        .pipe(
          map(response => response.body),
          first(),
          share());

      observable.subscribe(value => this.objectMap.set(surrogateKey, value));
    }

    return observable;
  }

  public createObject(url: string, payload: CreateRequest, image: Blob): Observable<CreateResponse> {
    const formData: FormData = new FormData();
    formData.append(AppConstant.PAYLOAD, UtilService.dataToBlob(payload));
    formData.append(AppConstant.IMAGE, image);

    return (new RestTemplateBuilder())
      .withAuthHeader()
      .put<FormData, CreateResponse>(url, formData)
      .pipe(
        map(response => response.body),
        first(),
        share());
  }
}
