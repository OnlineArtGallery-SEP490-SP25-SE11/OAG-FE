export type ApiResponse = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
	message: string | null;
	status: number;
	errorCode: string | null;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	details: any;
};
 type BaseResponse<T = null> = {
	data: T;
	message: string;
	statusCode: number;
	errorCode: string | null;
	details: unknown | null;
}

export default BaseResponse;