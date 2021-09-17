import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingStatusService {

  static LOADING_STATUS = false;

  constructor() { }

  private loadingStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(LoadingStatusService.LOADING_STATUS);

  startLoading() {
    setTimeout(() => this.loadingStatus$.next(true), 500);
  }

  stopLoading() {
    setTimeout(() => this.loadingStatus$.next(false), 500);
  }

  getLoading() {
    return this.loadingStatus$;
  }
}
