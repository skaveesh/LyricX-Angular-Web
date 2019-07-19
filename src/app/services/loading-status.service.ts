import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingStatusService {

  static LOADING_STATUS = false;

  constructor() { }

  private loadingStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(LoadingStatusService.LOADING_STATUS);

  startLoading() {
    this.loadingStatus$.next(true);
  }

  stopLoading() {
    this.loadingStatus$.next(false);
  }

  getLoading() {
    return this.loadingStatus$;
  }
}
