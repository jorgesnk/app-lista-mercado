import {Subject} from 'rxjs';

class ProductService {
  product = new Subject();
  toListener = true;
  setProduct(value) {
    this.product.next(value);
  }
}

export default new ProductService();
