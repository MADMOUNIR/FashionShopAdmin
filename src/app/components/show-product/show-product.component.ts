import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product';
import { Response } from 'src/app/models/response';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ProductsService } from 'src/app/services/products.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-show-product',
  templateUrl: './show-product.component.html',
  styleUrls: ['./show-product.component.css']
})
export class ShowProductComponent implements OnInit {

  @Input() products : Product[] ;
  ProductModalOpen : boolean = false;
  selectedProduct : Product ;
  file : File ;
  progress : number = 0 ;
  baseURLImage : string = `${environment.api_image}`;
  DeleteModalOpen : boolean = false ;
  productToDelete : Product ;


  constructor(private productService : ProductsService ,private fileUploadService : FileUploadService) { }

  ngOnInit(): void {
  }

    //---------Méthode d'ouverture des fenetre modal --------------//
  onEdit( product : Product) :void {

    this.ProductModalOpen = true;
    this.selectedProduct = product ;

  }

  onDelete(product : Product) : void {
    this.DeleteModalOpen = true ;
    this.productToDelete = product;

  }

  AddProduct() : void {
    this.selectedProduct = undefined ;
    this.ProductModalOpen = true;

  }

  //---------Au retour du wizard on traite les résultats --------------//

  //------------------Finish di wizard add/edit----------------//
  handleFinish(event) {

    if(event) {

    let product = event.product != null ? event.product : null ;
    this.file = event.file ? event.file : null
    if (product)
    {

      if(this.selectedProduct )
      {
        //Edit product
        product.idProduct = this.selectedProduct.idProduct ;
        this.editProductToServer(product);
      }
      else
      {
        //Add Product
        this.addProductToServer(product);
      }

    }
  }
    this.ProductModalOpen = false ;
  }

 //------------------confirm or not delete----------------//
  handleCancelDelete()
  {
    this.DeleteModalOpen = false;
  }

  handleConfirmDelete()
  {
    this.productService.deleteProduct(this.productToDelete).subscribe(
      (data : Response) => {
        if(data.status == 200)
        {
          console.log("Produit supprimé !");

          //Delete Image
          this.fileUploadService.deleteImage(this.productToDelete.image).subscribe(
            (data : Response) => {
                console.log(data);
            }
          );
          //Update Frontend
          const index = this.products.findIndex(p => p.idProduct == this.productToDelete.idProduct);
          this.products .splice(index , 1);


        }
        else
        {
          console.log(data.message);

        }



      }
    );

    this.handleCancelDelete();

  }

//-------------------Utilistaires ------------------//

//Suivre le statut d'upload de l'image ---------------//
  uploadImage(event ) {
   return new Promise(
     (resolve, rejects) =>
     {
      switch (event.type) {
        case HttpEventType.Sent:

          break;
        case HttpEventType.UploadProgress :
          this.progress = Math.round(event.loaded /event.total * 100);
          if(this.progress == 100) {
            resolve(true);
          }
          break;

          case HttpEventType.Response :

            setTimeout(() => {
              this.progress = 0 ;
            }, 1500);
            break;


      }

     }
   )


  }



  //-----------------------------------------------//
  //--------Add Product to serve -----------------//
  //-----------------------------------------------//
  addProductToServer (product ) : void {
    this.productService.addProduct(product).subscribe (
      (data) => {
        if(data.status == 200)
        {
          //upload du fichier en appelant le service
          if(this.file)
          {
            this.fileUploadService.uploadImage(this.file).subscribe (
                (event : HttpEvent<any>) => {
                  this.uploadImage(event).then(
                  () =>  {
                      //update du grid des produits (frontend)
                      product.idProduct = data.args.lastInsertId ;
                      product.Category = product.category;
                      this.products.push(product) ;
                  }
                  ) ;

                }
            )
          }

        }

      }

    );
  }


  //-----------------------------------------------//
  //--------Edit Product to server -----------------//
  //-----------------------------------------------//
  editProductToServer(product )  {

    this.productService.editProduct(product).subscribe(
      (data : Response) => {
        if(data.status == 200) {

          //---1- Traitement de l'image (si uploadé ou pas )
          if(this.file)
          {
            this.fileUploadService.uploadImage(this.file).subscribe(
              (event : HttpEvent<any>) => {
                this.uploadImage(event).then(
                  () => {
                      //---Update forntend après mise à jour du backend
                      this.updateProductFrontEnd(product) ;

                  }
                );
              }
            );

            //Supprimer l'ancien image
            this.fileUploadService.deleteImage(product.oldImage).subscribe(
              ((date :Response) => {
                console.log("image old supprimé !");
              })
            ) ;
          }
          else //Pas de changement de l'image , on mis à jour le frontend
          {
            this.updateProductFrontEnd(product) ;
          }



        }
        else
        {
          console.log(data.message);

        }
      }
    );

  }

//---Update forntend après mise à jour du backend
  updateProductFrontEnd(product) {

      //---Update forntend après mise à jour du backend
      const index = this.products.findIndex(p => p.idProduct == product.idProduct) ;

      product.Category = product.category ;
      this.products = [
        ...this.products.slice(0 , index) ,
        product ,
        ...this.products.slice(index+1)

      ];


  }

}
