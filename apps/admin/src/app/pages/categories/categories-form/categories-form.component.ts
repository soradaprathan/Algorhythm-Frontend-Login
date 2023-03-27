import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '@algorhythm/products';
import { Category } from '@algorhythm/products';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'admin-categories-form',
  templateUrl: './categories-form.component.html',
  styles: [
  ]
})
export class CategoriesFormComponent implements OnInit {

  form!: FormGroup;
  isSubmitted = false;
  editmode = false;
  currentCategoryId!: string;
  endsubs$: Subject<any> = new Subject();

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private CategoriesService: CategoriesService,
    private location: Location,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
      color: ['#fff']
    });

    this._checkEditMode();
  }

  ngOnDestroy() {
    this.endsubs$.next(null);
    this.endsubs$.complete();
  }

  OnSubmit() { 
    this.isSubmitted = true;
    if (this.form.invalid) { return; }

    const category: Category = {
      id: this.currentCategoryId,
      cat_name: this.categoryForm['name'].value,
      cat_icon: this.categoryForm['icon'].value,
      cat_color: this.categoryForm['color'].value
    };
    if (this.editmode) {
      this._updateCategory(category)
    } else { 
      this._addCategory(category)
    }
  }

  onCancle() {
    this.location.back();
  }

  private _addCategory(category: Category) {
     this.CategoriesService
     .createCategory(category)
     .pipe(takeUntil(this.endsubs$))
     .subscribe(
      (category: Category) => { 
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Success', 
        detail: `Category ${category.cat_name} is Created!`
      });
      timer(2000).toPromise().then(() => { 
        this.location.back();
      })
    },
      () => { 
         this.messageService.add({severity:'error', summary:'Error', detail:'Category is  NOT Created!'});
      });
  }
  
  private _updateCategory(category: Category) { 
      this.CategoriesService
      .updateCategory(category)
      .pipe(takeUntil(this.endsubs$))
      .subscribe(() => { 
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category is Updated!' });
      timer(2000).toPromise().then(() => { 
        this.location.back();
      })
    },
      () => { 
         this.messageService.add({severity:'error', summary:'Error', detail:'Category is  NOT Updated!'});
      });
  }

  private _checkEditMode() { 
    this.route.params.subscribe(params => { 
      if (params['id']) { 
        this.editmode = true;
        this.currentCategoryId = params['id'];
        this.CategoriesService
        .getCategory(params['id'])
        .pipe(takeUntil(this.endsubs$))
        .subscribe(category => { 
          this.categoryForm['name'].setValue(category.cat_name);
          this.categoryForm['icon'].setValue(category.cat_icon);
          this.categoryForm['color'].setValue(category.cat_color);
        })
      }
    })
  }

  get categoryForm() { 
    return this.form.controls;
  }


}
