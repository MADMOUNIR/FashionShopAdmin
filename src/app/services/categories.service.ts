import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private baseURL = `${environment.api+'category'+'?API_KEY='+environment.api_key}`;

  constructor(private http : HttpClient) { }

  getCaegories() : Observable<Response> {
    return this.http.get<Response>(this.baseURL);

  }
}
