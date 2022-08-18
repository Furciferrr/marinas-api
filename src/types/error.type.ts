export interface ErrorType {
  errorsMessages: {
    message: string;
    field: string;
  }[];
  resultCode: 0 | 1 | 2;
}
