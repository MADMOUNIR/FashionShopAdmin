import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { event } from '@cds/core/internal';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { CategoriesService } from 'src/app/services/categories.service';




@Component({
  selector: 'app-add-or-edit-product-modal',
  templateUrl: './add-or-edit-product-modal.component.html',
  styleUrls: ['./add-or-edit-product-modal.component.css']
})
export class AddOrEditProductModalComponent implements OnInit , OnChanges , OnDestroy{

  @Input() product : Product ;
  @Output() finish = new EventEmitter();
  productForm : FormGroup;
  categories : Category[] ;
  categoriesSub : Subscription ;
  idCategory : number = 1 ;
  file : File;

  constructor(private fb : FormBuilder , private categoriesService : CategoriesService) {
    this.productForm = fb.group({
      productInfo : fb.group(
        {
          name : ['', Validators.required] ,
          description : ['', Validators.required] ,
          price : ['', Validators.required] ,
          stock : ['', Validators.required] ,
        }
      ) ,
      productIllustration : fb.group(
        {
          image : ['', Validators.required]
        }
      )


    }
    );

  }

  //---------------Evenment des controls ----------------------//
  get isProductInfoInvalid () : boolean {
    return this.productForm.get('productInfo').invalid ;
  }
  get isProductIllustrationInvalid() : boolean {
  if(this.productForm){
    return false;
  }
    return this.productForm.get('productIllustration').invalid ;
  }


  selectCategory(id : number) : void {
    this.idCategory = id ;

  }

  detectFiles(event ) {
    this.file = event.target.files[0] ;

  }

  //remplir les champs lors de l'update

  updateForm(produit : Product) {
    this.productForm.patchValue({
      productInfo : {
        name : 	produit.name ,
        description : 	produit.description ,
        price : 		produit.price ,
        stock : 		produit.stock
      }
    });
    produit.oldImage = produit.image ;
    this.selectCategory(produit.Category);

  }

  //---------------Evenment du wizard ----------------------//
  // fermer le wizard
  close () {
    this.productForm.reset();
    this.idCategory = 0 ;
  }

  handleCancel() {
    this.finish.emit();
    this.close();

  }
  handleFinish() {

    const product = {
      ...this.productForm.get('productInfo').value ,
      ...this.productForm.get('productIllustration').value ,
      category : this.idCategory,
      oldImage : null
    }
    if(this.product) {
      product.oldImage = this.product.oldImage ;
    }
    if(this.file)
    {
      product.image = this.file.name ;
    }
    else
    {
      product.image = this.product.oldImage ;
    }

    this.finish.emit({product : product , file : this.file ? this.file : null});
    this.close();

  }


//----------- METHODE ANGULAR ----------------->


//-----Récupération des produit à l'initialisation
ngOnInit(): void {
    this.categoriesSub = this.categoriesService.getCaegories().subscribe(
      (response) =>
      {
        this.categories = response.result ;

      },
      (error) =>
      {
        console.log("erreur de recup des catégories :"+error);

      },
      () =>
      {
       // console.log("recup Categorie terminée !");

      }

    );
  }
  //-----Detection du changement du produit
  ngOnChanges() : void {
    if(this.product) {
      this.updateForm(this.product) ;
    }

  }

  //-----Désabonnement du subscreption
  ngOnDestroy() : void {
    this.categoriesSub.unsubscribe();
  }



}
