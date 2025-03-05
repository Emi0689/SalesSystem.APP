import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Category } from '../Interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private urlApi:string = environment.endpoint + "Category/";

  constructor(private http:HttpClient) { }

  getAll():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}GetAll`)
  }
}
