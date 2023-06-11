import {BaseHttpResponse} from './base-http-response';

interface MetadataInnerDataObj {
  'baseImageBucketURL': string;
}

interface MetadataDataObj {
  'data': MetadataInnerDataObj;
}

export type Metadata = BaseHttpResponse & MetadataDataObj;
