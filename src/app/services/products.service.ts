import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode  } from '@angular/common/http';
import { Product, CreateProductDTO, UpdateProductDTO } from '../models/products.model';
import { retry, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from './../../environments/environment'
 

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = `${environment.API_URL}/api/products`;

  constructor(
    private http: HttpClient
  ) { }

  getAllProducts (limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit && offset) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(this.apiUrl, { params })
    .pipe(
      retry(3),
      map(products => products.map(item => {
        return {
          ...item,
          taxes: .19 * item.price
        }
      }))
    );
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Conflict) {
          return throwError('something bad at server');  
        }
        if (error.status === HttpStatusCode.NotFound) {
          return throwError('product dont exits');  
        }
        if (error.status === HttpStatusCode.Unauthorized) {
          return throwError('user denaet');  
        }
        return throwError('ups something bad');
      })
    )
  }


  getProductByPage(limit: number, offset: number) {
    return this.http.get<Product[]>(`${this.apiUrl}`, {
      params: {limit, offset}
    })
  }

  create(data: CreateProductDTO) {
    return this.http.post<Product>(this.apiUrl, data);
  }

  update(id: string,  dto: UpdateProductDTO ) {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, dto)
  }

  delete(id : string) {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}
