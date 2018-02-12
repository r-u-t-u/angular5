import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MealApiService } from '../services/meal.api.service';
import { Meal } from '../models/meal';

@Component({
    selector: 'foodie-home',
    templateUrl: '../templates/food.component.html',
    styleUrls: ['../templates/food.css']
})
export class FoodHomeComponent {
    meals: Meal[]; // -->
    categories: string[]; // -->
    cuisines: string[]; // -->
    currFilterOption = 'cuisine'; // -->
    filterOptions: string[]; // -->
    filterBy: string;  // --> 
    resultString: string; // -->

    mealDetail: Meal;

    constructor(private webService: MealApiService, private router: Router) {
        this.categories = [];
        this.webService.getAllCategories().subscribe(data => {
            data.forEach(element => { this.categories.push(element.strCategory) });
        });

        this.cuisines = [];
        this.webService.getAllCuisines().subscribe(data => {
            data.forEach(element => { this.cuisines.push(element.strArea) });
        });

        this.meals = [];
        this.filterOptions = this.cuisines;
    }

    searchMealData(searchInput: string) {
        // console.log(`Input string ${searchInput}`);
        this.webService.searchMealData(searchInput).subscribe(data => {
            this.meals = data;
        });
        this.resultString = `Search Result for ${searchInput}`;
    }

    changeFilterOption($event) {
        this.currFilterOption = event.target.value;
        if (this.currFilterOption === 'cuisine')
            this.filterOptions = this.cuisines;
        else if (this.currFilterOption === 'category')
            this.filterOptions = this.categories;
    }

    filterMealData(filterBy: string) {
        // console.log(`Filter option ${filterBy}`);
        if (this.currFilterOption === 'cuisine') {
            this.webService.getMealByCuisine(filterBy).subscribe(data => {
                this.meals = data;
            });
        } else if (this.currFilterOption === 'category') {
            this.webService.getMealByCategory(filterBy).subscribe(data => {
                this.meals = data;
            });
        }
        this.resultString = `Filter Result for ${filterBy} ${this.currFilterOption}`;
    }

    navigateTo(idMeal: number) {
        this.router.navigate(['food-app/meal', idMeal]);
    }
}
