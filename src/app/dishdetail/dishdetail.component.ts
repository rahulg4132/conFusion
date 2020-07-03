import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import {switchMap} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Comment} from '../shared/comment';
import {visibility, flyInOut, expand} from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display:block'
  },
  animations: [
    flyInOut(),
    visibility(),
    expand()
  ]  
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  errMess: string;
  dishIds: string[];
  prev: string;
  next: string;
  commentform: FormGroup;
  comment: Comment;
  @ViewChild('cform') commentformDirective;
  dishcopy: Dish;
  visibility="shown";

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

  constructor(private dishService: DishService, private location: Location, private route: ActivatedRoute, private fb: FormBuilder, @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    this.createForm();

    this.dishService.getDishIds()
      .subscribe(dishIds=>this.dishIds=dishIds);
    this.route.params
      .pipe(switchMap((params: Params)=> {
        this.visibility='hidden';
        return this.dishService.getDish(params['id']);
      }))
      .subscribe((dish)=>{this.dish = dish; this.dishcopy=dish; this.setPrevNext(dish.id);this.visibility='shown';},
      errmess=>this.errMess=<any>errmess);
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
    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy)
    .subscribe(dish=>{
      this.dish=dish;
      this.dishcopy=dish;      
    },
    errmess=>{this.dish=null; this.dishcopy=null; this.errMess=<any>errmess;});
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
