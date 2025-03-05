import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Sale } from '../Interfaces/sale';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private urlApi:string = environment.endpoint + "Sale/";

  constructor(private http:HttpClient) { }

  create(request:Sale):Observable<ResponseApi>
  {
    return this.http.post<ResponseApi>(`${this.urlApi}Create`, request)
  }

  history(searchFor: string, saleNumber: string, startDate: string, endDate: string):Observable<ResponseApi>
  {
    return this.http.get<ResponseApi>(`${this.urlApi}History?searchFor=${searchFor}&saleNumber=${saleNumber}&startDate=${startDate}&endDate=${endDate}`)
  }

  report(startDate: string, endDate: string):Observable<ResponseApi>
  {
    return this.http.get<ResponseApi>(`${this.urlApi}ReportstartDate=${startDate}&endDate=${endDate}`)
  }

}
