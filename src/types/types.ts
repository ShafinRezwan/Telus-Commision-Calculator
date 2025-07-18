// 2 tabs
export type Tab = "calculate" | "orders";


export interface Order {
  id: string;
  service: string;
  orderNumber: string;
  accountNumber: string;
  phoneNumber?: string;
  note?: string;
  commission: number;
  sv: number;
}
