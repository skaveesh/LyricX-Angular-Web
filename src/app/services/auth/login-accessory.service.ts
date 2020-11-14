import {Injectable} from '@angular/core';
import {NavigationCancel, Router} from '@angular/router';
import {Constants} from '../../constants/constants';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';

@Injectable({
  providedIn: 'root'
})
export class LoginAccessoryService {

  constructor(private router: Router) {
     this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationCancel && isNotNullOrUndefined(ev) && ev.reason.includes(Constants.Symbol.FORWARD_SLASH + Constants.Route.LOGIN)) {
        sessionStorage.setItem(Constants.Session.AFTER_LOGIN_PATH_KEY, ev.url.toString());
      }
    });
  }

}
