import { CozyA1Room } from '@/app/(exhibitions)/[locale]/exhibitions/components/galleries/cozy-gallery/cozy-gallery';
import { M2Room } from '@/app/(exhibitions)/[locale]/exhibitions/components/galleries/classic-gallery/classic-gallery';
import { WareHouseRoom } from '@/app/(exhibitions)/[locale]/exhibitions/components/galleries/warehousw-gallery/warehouse-gallery';
// Import other room types as needed

export const ROOM_REGISTRY = {
  'cozy': CozyA1Room, // A one room gallery with a wall divider in the middle
  'classic': M2Room, // minimalist basic room with white color
  'warehouse': WareHouseRoom, // A small warehouse with two floors

};

export type RoomType = keyof typeof ROOM_REGISTRY;