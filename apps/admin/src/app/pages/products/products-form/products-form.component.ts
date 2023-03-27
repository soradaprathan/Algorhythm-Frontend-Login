import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category, ProductsService, Product } from '@algorhythm/products';
import { MessageService } from 'primeng/api';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-products-form',
  templateUrl: './products-form.component.html',
  styles: []
})
export class ProductsFormComponent implements OnInit{
  editmode = false;
  form!: FormGroup;
  isSubmitted = false;
  categories: Category[] = [];
  imageDisplay: string | ArrayBuffer | undefined;
  currentProductId!: string;
  endsubs$: Subject<any> = new Subject();

  constructor( 
    private formBuilder: FormBuilder, 
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute
    ) {}

  ngOnInit(): void {
      this._initForm();
      this._getCategories();
      this._checkEditMode();
  }

  ngOnDestroy() {
    this.endsubs$.next(null);
    this.endsubs$.complete();
  }
  
  private _initForm() {
    this.form = this.formBuilder.group({
      prod_name: ['', Validators.required],
      prod_brand: ['', Validators.required],
      prod_price: ['', Validators.required],
      prod_category: ['', Validators.required],
      prod_stockCount: ['', Validators.required],
      prod_description: ['', Validators.required],
      prod_richDescription: [''],
      prod_image: ['', Validators.required],
      prod_featured: [false]
    });
  }

  private _getCategories() {
    this.categoriesService
    .getCategories()
    .pipe(takeUntil(this.endsubs$))
    .subscribe((categories) => {
      this.categories = categories;
    });
  }

  private _addProduct(productData: FormData) {
    this.productsService
    .createProduct(productData)
    .pipe(takeUntil(this.endsubs$))
    .subscribe(
     (product: Product) => { 
     this.messageService.add({ 
       severity: 'success', 
       summary: 'Success', 
       detail: `Product ${product.prod_name} is Created!`
     });
     timer(2000).toPromise().then(() => { 
       this.location.back();
     })
   },
     () => { 
        this.messageService.add({severity:'error', summary:'Error', detail:'Product is  NOT Created!'});
     });
 }

 private _updateProduct(productFormData: FormData) {
  this.productsService
  .updateProduct(productFormData, this.currentProductId)
  .pipe(takeUntil(this.endsubs$))
  .subscribe(
    () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Product is updated!'
      });
      timer(2000)
        .toPromise()
        .then(() => {
          this.location.back();
        });
    },
    () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Product is not updated!'
      });
    }
  );
}

private _checkEditMode(){
    this.route.params.pipe(takeUntil(this.endsubs$)).subscribe(params => { 
      
      if (params['id']) { 
        this.editmode = true;
        this.currentProductId = params['id'];
        this.productsService
        .getProduct(params['id'])
        .pipe(takeUntil(this.endsubs$))
        .subscribe((product) => {
          this.productForm['prod_name'].setValue(product.prod_name);
          this.productForm['prod_category'].setValue(product.prod_category?.id);
          this.productForm['prod_brand'].setValue(product.prod_brand);
          this.productForm['prod_price'].setValue(product.prod_price);
          this.productForm['prod_stockCount'].setValue(product.prod_stockCount);
          this.productForm['prod_featured'].setValue(product.prod_featured);
          this.productForm['prod_description'].setValue(product.prod_description);
          this.productForm['prod_richDescription'].setValue(product.prod_richDescription);
          this.imageDisplay = product.prod_image
          this.productForm['prod_image'].setValidators([]);
          this.productForm['prod_image'].updateValueAndValidity();
  
          console.log(product['prod_image']);
        });
      }
    })
   }
   
   onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {return;}
    const productFormData = new FormData();

    Object.keys(this.productForm).map((key) => {
      console.log(key);
      console.log(this.productForm[key].value);
      productFormData.append(key, this.productForm[key].value);
    });
    if (this.editmode) {
      this._updateProduct(productFormData);
    } else {
      this._addProduct(productFormData);
    }
  
  }
  onCancle() {
    this.location.back();
   }

  onImageUpload(event: any){
    const file = event.target.files[0];
    if(file){
      this.form.patchValue({prod_image: file });
      this.form.get('prod_image')?.updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result!;
      }
      fileReader.readAsDataURL(file);
    }
  }

  get productForm() {
    return this.form.controls;
  }

}
