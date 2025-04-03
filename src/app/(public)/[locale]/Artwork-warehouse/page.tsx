import { Metadata } from 'next';
import WarehouseClient from './components/warehouse-client';

export const metadata: Metadata = {
    title: 'Kho tranh | Online Art Gallery',
    description: 'Xem và tải các tác phẩm nghệ thuật bạn đã mua',
};

export default function ArtworkWarehousePage() {
    return <WarehouseClient />;
}