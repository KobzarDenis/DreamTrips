export enum RequestType {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete'
}

export type Handler = {
  type: RequestType,
  event: string,
  handler: Function | Function[]
};
