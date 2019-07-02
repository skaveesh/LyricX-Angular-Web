import { Injectable } from '@angular/core';
import {HttpRoot} from './HttpRoot';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends HttpRoot {

  constructor() {
    super();

  }
}
