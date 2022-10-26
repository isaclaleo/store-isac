import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/models/products.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

@Input()  product: Product = {
    id: 1,
    name: '',
    image: '',
    price: 0,
    describe: ''
  };

  @Output() addedProduct = new EventEmitter<Product>();

  constructor() { }

  ngOnInit(): void {
  }
  onAddToCard () {
    this.addedProduct.emit(this.product);
  }
}
