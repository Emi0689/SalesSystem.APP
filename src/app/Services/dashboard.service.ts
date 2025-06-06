import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private urlApi:string = environment.endpoint + "Dashboard/";

  constructor(private http:HttpClient) { }

  resume():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Resume`)
  }

}
