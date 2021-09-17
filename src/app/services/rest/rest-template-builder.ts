import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {UserAuthorizationService} from '../auth/user-authorization.service';
import {Constants} from '../../constants/constants';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {catchError} from 'rxjs/operators';
import {UtilService} from '../util.service';
import AppConstant = Constants.AppConstant;
import Symbol = Constants.Symbol;
import {UserTokenError} from '../../errors/user-token-error';

let httpClient: HttpClient;
let userAuthorizationService: UserAuthorizationService;

@Injectable({
  providedIn: 'root'
})
export class RestTemplate {
  constructor(private http: HttpClient, private userAuth: UserAuthorizationService) {
    httpClient = this.http;
    userAuthorizationService = this.userAuth;
  }
}

export class RestTemplateBuilder {

  private headers = new HttpHeaders();
  private params = new HttpParams();

  private static getBearerToken(): string {

    const userToken = sessionStorage.getItem(Constants.Session.USER_TOKEN);

    if (!isNotNullOrUndefined(userToken)) {
      console.error(Constants.Error.USER_TOKEN_NOT_FOUNT);
      userAuthorizationService.logout();
      throw new UserTokenError('User logged-out. Pending request cancelled');
    }

    return AppConstant.BEARER + Symbol.WHITESPACE + userToken;
  }

  public withJsonContentType(): RestTemplateBuilder {
    this.headers = this.headers.set(AppConstant.CONTENT_TYPE, AppConstant.APPLICATION_JSON);
    return this;
  }

  public withMultipartFormDataContentType(): RestTemplateBuilder {
    this.headers = this.headers.set(AppConstant.CONTENT_TYPE, AppConstant.MULTIPART_FORM_DATA);
    return this;
  }

  public withAuthHeader(): RestTemplateBuilder {
    this.headers = this.headers.set( AppConstant.AUTHORIZATION, RestTemplateBuilder.getBearerToken());
    return this;
  }

  public withParam(key: string, value: string): RestTemplateBuilder {
    this.params = this.params.set(key, value);
    return this;
  }

  public get<R>(url: string): Observable<HttpResponse<R>> {
    return httpClient.get(url, {
      headers: this.headers,
      observe: AppConstant.RESPONSE,
      params: this.params
    }).pipe(catchError(UtilService.handleErrorObservable));
  }

  public post<P, R>(url: string, body: P): Observable<HttpResponse<R>> {
    return httpClient.post(url, <P> body, {
      headers: this.headers,
      observe: AppConstant.RESPONSE,
      params: this.params
    }).pipe(catchError(UtilService.handleErrorObservable));
  }

  public put<P, R>(url: string, body: P): Observable<HttpResponse<R>> {
    return httpClient.put(url, <P> body, {
      headers: this.headers,
      observe: AppConstant.RESPONSE,
      params: this.params
    }).pipe(catchError(UtilService.handleErrorObservable));
  }

}
