import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { property } from '@cds/core/internal';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';
import { Response } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private baseURL = `${environment.api+'products'+'?API_KEY='+environment.api_key}`;
  private baseUrlUpdate =  `${environment.api+'updateProducts.php'+'?API_KEY='+environment.api_key}`;
  constructor(private http : HttpClient) { }

  //----------Récupération des produits ---------------//
  getProducts() : Observable<Response>  {
    return this.http.get<Response>(this.baseURL);
  }

  //----------Ajout des produits ---------------//
  addProduct(product : Product) : Observable<Response>
  {
    let params = new FormData();
    params.append('name' , product.name);
    params.append('description' , product.description);
    params.append('image' , product.image);
    params.append('price' , `${product.price}`);
    params.append('stock' , `${product.stock}`);
    params.append('category' , `${product.Category}`);

    return this.http.post<Response>(this.baseURL , params);
  }


  //----------Modification des produits ---------------//
  editProduct(product : Product) : Observable<Response>
  {
    const url = this.baseUrlUpdate + this.constructURLParams(product);
    console.log("Product obj :");
    console.log(product);
    console.log("url :"+url);


    return this.http.get<Response>(url) ;
  }


  deleteProduct(product: Product): Observable<Response>{
    const url = this.baseURL+"&id="+product.idProduct;
    return this.http.delete<Response>(url);
  }

  //-----Utilitaires ------------------//

  //Construction de l'URL de l'update
  constructURLParams = (object) => {

    let result = '' ;
    for (const property in object){
      result += `&${property}=${object[property]}` ;
    }
    return result ;
  }

}
