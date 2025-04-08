import { SaleDetails } from "./saleDetails";

export interface Sale {
  idSale?: number,
  idNumber?: string,
  paymentType?: string,
  totalText?: string,
  timestamp?: string,
  saleDetails?:SaleDetails[]
}
