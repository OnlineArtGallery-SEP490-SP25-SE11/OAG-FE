// import { env } from "process";
import { assertAdmin, assertArtist, assertAuthenticated } from '@/lib/session';
import { createServerActionProcedure } from 'zsa';
import { PublicError } from '@/lib/errors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shapeErrors({ err }: any) {
	const isAllowedError = err instanceof PublicError;
	// let's all errors pass through to the UI so debugging locally is easier
	// const isDev = env.NODE_ENV === "development";
	const isDev = false;
	if (isAllowedError || isDev) {
		console.error(err);
		return {
			code: err.code ?? 'ERROR',
			message: `${isDev ? 'DEV ONLY ENABLED - ' : ''}${err.message}`
		};
	} else {
		return {
			code: 'ERROR',
			message: 'somethingWentWrong'
		};
	}
}

export const authenticatedAction = createServerActionProcedure()
	.experimental_shapeError(shapeErrors)
	.handler(async () => {
		const user = await assertAuthenticated();
		return { user };
	});

export const unauthenticatedAction = createServerActionProcedure()
	.experimental_shapeError(shapeErrors)
	.handler(async () => {
		return { user: undefined };
	});

export const adminOnlyAction = createServerActionProcedure()
	.experimental_shapeError(shapeErrors)
	.handler(async () => {
		const user = await assertAdmin();
		return { user };
	});

export const artistOnlyAction = createServerActionProcedure()
	.experimental_shapeError(shapeErrors)
	.handler(async () => {
		const user = await assertArtist();
		return { user };
	})