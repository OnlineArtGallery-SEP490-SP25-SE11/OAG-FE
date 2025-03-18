export interface Transaction {
    _id: string;
    userId: string;
    amount: number;
    status: "PAID" | "PENDING" | "FAILED";
    paymentUrl: string;
    orderCode: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface PaymentResponse {
    data: {
        payment: Transaction[];
        total: number;
    };
    message: string;
    statusCode: number;
    errorCode: null | string;
    details: null | any;
}

export interface DepositMethod {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    disabled: boolean;
}

export interface PresetAmount {
    value: number;
    label: string;
}
