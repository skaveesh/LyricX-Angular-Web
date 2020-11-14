import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {UserAuthorizationService} from '../auth/user-authorization.service';
import {Constants} from '../../constants/constants';
import AppConstant = Constants.AppConstant;
import Symbol = Constants.Symbol;
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';

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

    if (isNotNullOrUndefined(userToken)) {
      return AppConstant.BEARER + Symbol.WHITESPACE + userToken;
    } else {
      throw new Error(Constants.Error.USER_TOKEN_NOT_FOUNT);
    }
  }

  public withJsonContentType(): RestTemplateBuilder {
    this.headers = this.headers.set(AppConstant.CONTENT_TYPE, AppConstant.APPLICATION_JSON);
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

  public get<T>(url: string): Observable<T> {
    return httpClient.get<T>(url, {
      headers: this.headers,
      params: this.params
    });
  }

}
