export interface PurchaseOrder{
    purchaseOrder_id : number | null;
    date: string;
    total: string;
    client_id_fk : number;
    shippingAddress: string;
    orderStatus: string; 
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
    deleted: boolean;
}