import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {Constants} from '../constants/constants';
import AppConstant = Constants.AppConstant;
import Symbol = Constants.Symbol;

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  public static base64URItoBlob(dataURI: string): Blob {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(Symbol.COMMA)[0].indexOf(AppConstant.BASE64) >= 0) {
      byteString = atob(dataURI.split(Symbol.COMMA)[1]);
    } else {
      byteString = unescape(dataURI.split(Symbol.COMMA)[1]);
    }

    // separate out the mime component
    const mimeString = dataURI.split(Symbol.COMMA)[0].split(Symbol.COLON)[1].split(Symbol.SEMI_COLON)[0];

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type: mimeString});
  }

  public static dataToBlob(data: any): Blob {
    const str = JSON.stringify(data);
    const bytes = new TextEncoder().encode(str);
    return new Blob([bytes], {
      type: AppConstant.APPLICATION_JSON
    });
  }

  public static extractIdsFromChipListArray(array: string[]): number[] {
    return array.map(item => Number(item.substring(item.lastIndexOf(Constants.Symbol.DOLLAR_SIGN) + 1)));
  }

  /**
   * handle errors of observable
   * @param error the error
   * @returns Observable<any> the returned error
   */
  public static handleErrorObservable(error: any): Observable<any> {
    console.error('An error occurred in observable', error);
    return throwError(error.message || error);
  }

  /**
   * handle errors of promise
   * @param error the error
   * @returns Promise<any> the returned error
   */
  public static handleErrorPromise(error: any): Promise<any> {
    console.error('HTTP error occurred');
    return Promise.reject(error.message || error);
  }
}
