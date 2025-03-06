'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateProfilePages() {
    revalidatePath('/[locale]/settings/profile')
    revalidatePath('/[locale]/profile')
} 