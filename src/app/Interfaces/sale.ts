import { SaleDetail } from "./sale-detail";

export interface Sale {
  idSale?: number,
  idNumber?: string,
  paymentType?: string,
  totalText?: string,
  timestamp?: string,
  saleDetail?:SaleDetail[]
}
