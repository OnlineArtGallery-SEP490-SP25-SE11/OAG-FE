'use server';

import { artistOnlyAction } from "@/lib/safe-action";
import { createExhibition } from "@/service/exhibition";
import { z } from "zod";

export const createExhibitionAction = artistOnlyAction
    .createServerAction()
    .input(
        z.object({
            templateId: z.string(),
        })
    )
    .handler(async ({ input, ctx }) => {
        const { templateId } = input;  
        const res = await createExhibition(ctx.user.accessToken, templateId);
        return res.data;
    });