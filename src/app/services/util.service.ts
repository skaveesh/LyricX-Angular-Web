import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {Constants} from '../constants/constants';
import AppConstant = Constants.AppConstant;
import Symbol = Constants.Symbol;
import {ResourceUrl} from '../constants/resource-url';

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

  public static base64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    }));
  }

  public static base64DecodeUnicode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  public static openLinkInNewTab(url: string) {
    window.open(url, '_blank');
  }

  public static constructSongAlbumArtResourceUrl(resourceNameWithExtension: string) {
    if (resourceNameWithExtension === null || resourceNameWithExtension.trim().length === 0) {
      return Constants.Asset.ALBUM_IMAGE;
    }

    return ResourceUrl.ImageResource.SONG_ALBUM_ART_BASE_URL + resourceNameWithExtension;
  }

  public static constructAlbumArtResourceUrl(resourceNameWithExtension: string) {
    if (resourceNameWithExtension === null || resourceNameWithExtension.trim().length === 0) {
      return Constants.Asset.ALBUM_IMAGE;
    }

    return ResourceUrl.ImageResource.ALBUM_ART_BASE_URL + resourceNameWithExtension;
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

  public static urlRegexPattern(isEmptyValid: boolean = false): RegExp {
    return isEmptyValid ? /(^$|^(https?):\/\/[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|])/g : /^(https?):\/\/[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]/g;
  }
}
