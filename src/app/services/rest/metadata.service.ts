import {Injectable} from '@angular/core';
import {HttpRoot} from './http-root';
import {RestTemplateBuilder} from './rest-template-builder';
import {Metadata} from '../../dto/metadata';
import {first, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MetadataService extends HttpRoot {

  static BASE_IMAGE_URL: string = null;

  constructor() {
    super();
    this.getMetadata();
  }

  getMetadata() {
    (new RestTemplateBuilder())
      .get<Metadata>(this.GET_METADATA)
      .pipe(
        map(payload => payload.body),
        first())
      .subscribe(v => MetadataService.BASE_IMAGE_URL = v.data.baseImageBucketURL,
        e => {
          console.log(e);
          throw new Error('Couldn\'t fetch Metadata');
        });
  }
}
