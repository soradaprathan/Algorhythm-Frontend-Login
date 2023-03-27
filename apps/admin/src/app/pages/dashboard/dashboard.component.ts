import { Component, OnInit } from '@angular/core';
import { OrdersService } from '@algorhythm/orders';
import { ProductsService } from '@algorhythm/products';
import { UsersService } from '@algorhythm/users';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit{
[x: string]: any;
parseInt(arg0: any): string|number {
throw new Error('Method not implemented.');
}
  statistics = [];
  endsubs$: Subject<any> = new Subject();

  constructor(
    private userService: UsersService,
    private productService: ProductsService,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.ordersService.getOrdersCount(),
      this.productService.getProductsCount(),
      this.userService.getUsersCount(),
      this.ordersService.getTotalSales()
    ])
      .pipe(takeUntil(this.endsubs$))
      .subscribe((values) => {
      this.statistics = values;
    });
  }

  ngOnDestroy() {
    this.endsubs$.next(null);
    this.endsubs$.complete();
  }

}
