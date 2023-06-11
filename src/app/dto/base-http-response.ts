export interface BaseHttpResponse {
  'timestamp': string;
  'message': string;
  'errorCode': string;
}

interface BaseHttpResponseWithData {
  'data': any;
}

export type BasicHttpResponse = BaseHttpResponse & BaseHttpResponseWithData;
