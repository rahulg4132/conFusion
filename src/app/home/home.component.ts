import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import {DishService} from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import {PromotionService} from '../services/promotion.service';
import {Leader} from '../shared/leader';
import {LeaderService} from '../services/leader.service';
import {flyInOut, expand} from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display:block'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class HomeComponent implements OnInit {

  dish: Dish;
  dishErrMess: string;
  proErrMess: string;
  leadErrMess: string;
  promotion: Promotion;
  featuredleader: Leader;
  abcd: string;

  constructor(private dishService: DishService, private promotionService: PromotionService, private leaderservice: LeaderService, @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    this.dishService.getFeaturedDish()
    .subscribe((dishes)=>this.dish=dishes,
    errmess=>this.dishErrMess=<any>errmess);

    this.promotionService.getFeaturedPromotion()
    .subscribe((promo)=>this.promotion=promo,
    errmess=>this.proErrMess=<any>errmess);
    
    this.leaderservice.getFeaturedLeader()
    .subscribe((fl)=>this.featuredleader=fl,
    errmess=>this.leadErrMess=<any>errmess);
  }

}
