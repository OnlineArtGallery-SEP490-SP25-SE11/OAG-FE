'use server';

import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { purchaseExhibitionTicket } from "@/service/exhibition";

export const purchaseTicketAction = authenticatedAction
  .createServerAction()
  .input(z.object({
    exhibitionId: z.string()
  }))
  .handler(async ({ input, ctx }) => {
    const { exhibitionId } = input;
    
    const result = await purchaseExhibitionTicket(
      ctx.user.accessToken, 
      exhibitionId
    );

    revalidatePath(`/exhibitions/${exhibitionId}`);
    return result.data;
  });