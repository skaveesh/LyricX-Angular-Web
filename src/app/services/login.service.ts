import { Injectable } from '@angular/core';
import {HttpRoot} from './http-root';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends HttpRoot {

  constructor() {
    super();

  }
}
