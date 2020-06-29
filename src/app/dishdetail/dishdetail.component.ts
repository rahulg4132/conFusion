import { Component, OnInit, ViewChild } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import {switchMap} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Comment} from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  commentform: FormGroup;
  comment: Comment;
  @ViewChild('cform') commentformDirective;

  formErrors = {
    'author': '',    
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required': 'Author name is required.',
      'minlength': 'Author name must be at least 2 characters long.',
      'maxlength': 'Author name cannot be more than 25 characters long.'
    },
    'comment': {
      'required': 'Comment is required.',      
      'maxlength': 'Last name cannot be more than 300 characters long.'
    },    
  };

  constructor(private dishService: DishService, private location: Location, private route: ActivatedRoute, private fb: FormBuilder) { 
    this.createForm();
  }

  ngOnInit() {
    this.dishService.getDishIds()
      .subscribe(dishIds=>this.dishIds=dishIds);
    this.route.params
      .pipe(switchMap((params: Params)=>this.dishService.getDish(params['id'])))
      .subscribe((dish)=>{this.dish = dish; this.setPrevNext(dish.id);});
  }

  setPrevNext(dishId: string) {
    const index=this.dishIds.indexOf(dishId);
    this.prev=this.dishIds[(this.dishIds.length+index-1)%this.dishIds.length];
    this.next=this.dishIds[(this.dishIds.length+index+1)%this.dishIds.length];
  }

  createForm() {
    this.commentform=this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      rating: 5,
      comment: ['',[Validators.required, Validators.maxLength(300)]]
    });
    this.commentform.valueChanges
    .subscribe(data=>this.onValChanged(data));

    this.onValChanged();
  }

  onValChanged(data?: any) {
    if(!this.commentform) {return;}
    const form = this.commentform;
    for(const field in this.formErrors) {
      if(this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field]='';
        const control = form.get(field);
        if(control && control.dirty && !control.valid) {
          const messages=this.validationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.formErrors[field] +=messages[key]+' ';
            }
          }
        }
      }
    }
  }

  onsubmit() {
    this.comment = this.commentform.value;
    var d=new Date();
    this.comment.date=d.toISOString();
    this.dish.comments.push(this.comment);
    this.commentform.reset({
      author: '',
      rating: 5,
      comment: ''
    });
    //this.commentformDirective.resetForm();
  }

  formatLabel(value: number) {
    return value;    
  }

  goBack(): void {
    this.location.back();    
  }

}
