import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Response } from 'src/app/models/response';
import { Product } from 'src/app/models/product';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products : Product;
  productSub : Subscription;

  constructor(private productService : ProductsService) { }

  ngOnInit(): void {
    this.productSub = this.productService.getProducts().subscribe (
      (response : Response ) => {
        this.products = response.result ;
       // console.log(response);
      },
      (error) => {
        console.log("erreur de récupération des produits :"+error);

      }


    );
  }

}
