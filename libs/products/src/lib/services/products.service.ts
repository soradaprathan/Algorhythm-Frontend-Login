import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Product } from '../models/product';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  apiURLProducts = environment.apiUrl + 'products';
  constructor(private http: HttpClient) {}
  
  getProducts(): Observable<Product[]> { 
    return this.http.get<Product[]>(this.apiURLProducts);
  }

  createProduct(productData: FormData): Observable<Product> {
    return this.http.post<Product>(this.apiURLProducts, productData);
  }

  getProduct(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiURLProducts}/${productId}`);
  }

  updateProduct(productData: FormData, productId: string): Observable<Product> {
    const productFile = productData.get('prod_image');
    console.log(productFile);
    return this.http.put<Product>(`${this.apiURLProducts}/${productId}`, productData);
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURLProducts}/${productId}`);
  }

  getProductsCount(): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLProducts}/get/count`)
      .pipe(map((objectValue: any) => objectValue.productCount));
  }

}
