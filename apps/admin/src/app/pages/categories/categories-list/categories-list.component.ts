import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoriesService, Category } from '@algorhythm/products';
import { MessageService } from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'admin-categories-list',
  templateUrl: './categories-list.component.html',
  styles: [
  ]
})
export class CategoriesListComponent implements OnInit, OnDestroy {

  categories: Category[] = [];
  endsubs$: Subject<any> = new Subject();

  constructor(
    private categoryService: CategoriesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this._getCategories();
  }
  ngOnDestroy() {
    this.endsubs$.next(null);
    this.endsubs$.complete();
  }

  deleteCategory(categoryId: string) {
    this.confirmationService.confirm({
            message: 'Do you want to Delete this Category?',
            header: 'Delete Category',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.categoryService
                .deleteCategory(categoryId) 
                .pipe(takeUntil(this.endsubs$))
                .subscribe(
                  () => {
                    this._getCategories();
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category is deleted!' });
                  },
                  () => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Category is  NOT deleted!' });
                  });
            }
      });
  }

  updateCategory(categoryId: string) { 
    this.router.navigateByUrl(`categories/form/${categoryId}`)


  }
  
  private _getCategories() { 
     this.categoryService.getCategories().pipe(takeUntil(this.endsubs$)).subscribe(cats => {
      this.categories = cats;
    });
  }

}
