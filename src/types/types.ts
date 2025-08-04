// 2 tabs
export type Tab = "calculate" | "orders" | "profile";


export interface Order {
  tid: any;
  id: string;
  service: string;
  orderNumber: string;
  accountNumber: string;
  phoneNumber?: string;
  note?: string;
  commission: number;
  sv: number;
}
