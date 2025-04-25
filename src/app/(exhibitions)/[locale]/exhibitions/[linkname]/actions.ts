'use server';

import { authenticatedAction, unauthenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { purchaseExhibitionTicket, toggleArtworkLike, updateExhibitionAnalytics } from "@/service/exhibition";

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

export const likeArtworkAction = authenticatedAction
  .createServerAction()
  .input(z.object({
    exhibitionId: z.string(),
    artworkId: z.string()
  }))
  .handler(async ({ input, ctx }) => {
    const { exhibitionId, artworkId } = input;

    const result = await toggleArtworkLike(
      ctx.user.accessToken,
      exhibitionId,
      artworkId
    );

    return result.data;
  });


export const updateExhibitionAnalyticsAction = unauthenticatedAction
  .createServerAction()
  .input(z.object({
    exhibitionId: z.string(),
    timeSpent: z.number() // Time spent in seconds
  }))
  .handler(async ({ input }) => {
    const { exhibitionId, timeSpent } = input;
    const result = await updateExhibitionAnalytics(exhibitionId,
      timeSpent
    );

    revalidatePath(`/discover`);
    return result.data;
  });