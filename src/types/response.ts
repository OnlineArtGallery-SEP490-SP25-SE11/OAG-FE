export type ApiResponse = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  message: string | null;
  status: number;
  errorCode: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details: any;
};
