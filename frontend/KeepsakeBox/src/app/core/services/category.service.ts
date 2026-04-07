// import { HttpClient } from '@angular/common/http';
// import { ComponentFactoryResolver, Injectable, OnInit } from '@angular/core';
// import { AuthenticationService } from './authentication.service';
// import { CategoryList } from '../models/category-list.model';
// import { CategoryTranslation } from '../models/category-translation.model';

// import { BehaviorSubject } from 'rxjs';
// import { ResponseBasic } from '../models/response-basic.model';
// import { TranslationChangeEvent } from '@ngx-translate/core';

// //Request URLs
// const serverURL = "194.117.20.219"
// //const serverURL = "localhost"
// const getCategoriesURL = `http://${serverURL}:8080/categories?token=`
// const getCategoriesTranslationsURL = `http://${serverURL}:8080/categories/translations?token=`




// @Injectable({
//   providedIn: 'root'
// })
// export class CategoryService implements OnInit {

//   //All existing categories to identify images
//   private categories: String[] = [];

//   private categoriesRetrieved: boolean = false;
//   private categoriesTranslationsRetrieved: boolean = false;

//   private categoriesSize;

//   private translationCategoriesList;                                   

//   constructor(private http: HttpClient,
//               private authenticationService: AuthenticationService) {
//   }

//   async ngOnInit(): Promise<void> {
//     await this.getCategories();
//   }

//   async retrieveCategories(token: string): Promise<void>{
//     this.categoriesRetrieved = true;

//     await this.http.get<CategoryList>(`${getCategoriesURL}${token}`).toPromise()
//     .then(response => {
//       if (response) {
//         this.categories = [];
//         this.categoriesSize = new Map();
//         response.categories.forEach( el => {
//           this.categories.push(el.name);
//           this.categoriesSize.set(el.name, el.image_number);
//         });
//       }
//     }).catch(error => {
//       this.categoriesRetrieved = false;
//     });
//   }

//   async retrieveCategoriesTranslations(token: string): Promise<void>{
//     this.categoriesTranslationsRetrieved = true;

//     await this.http.get<CategoryTranslation>(`${getCategoriesTranslationsURL}${token}`).toPromise()
//     .then(response => {
//       if (response) {
//         this.translationCategoriesList = new Map();
//         response.categories.forEach( el => {
//           let trans = el.split(":");
//           if (this.translationCategoriesList.has(trans[0])) {
//             this.translationCategoriesList.set(trans[0],this.translationCategoriesList.get(trans[0]).set(trans[1],trans[2]));  
//           } else {
//             this.translationCategoriesList.set(trans[0],new Map());
//             this.translationCategoriesList.set(trans[0],this.translationCategoriesList.get(trans[0]).set(trans[1],trans[2]));
//           }
//         });
//       }
//     }).catch(error => {
//       this.categoriesTranslationsRetrieved = false;
//     });
//   }

//   /**
//    * Gets all image existing categories
//    * @returns list of all categories defined
//    */
//   async getCategories(): Promise<String[]>{
//     // if (! this.categoriesRetrieved) {
//       await this.retrieveCategories(this.authenticationService.getCurrentCaregiverToken());
//       await this.retrieveCategoriesTranslations(this.authenticationService.getCurrentCaregiverToken());  
//     //}
//     return this.categories;
//   }

//   categoryImagesNumber(category: string): number {
//     try {
//       return(this.categoriesSize.get(category));
//     } catch (e) {
//       return(0);
//     }
//   }

//   categoryTranslation(category: string, language: string): string {
//     if (! this.categoriesRetrieved) {
//       return "No category available yet"
//     }
//     try {
//       return(this.translationCategoriesList.get(category).get(language));
//     } catch (e) {
//       return(this.translationCategoriesList.get("Outra").get(language));
//     }
//   }

//   categoriesTranslation(categoryList: string, language: string): string {
//     var result: string = "";
//     var categories = categoryList.split(",");
//     for (let cat of categories) {
//       if (result.length == 0) {
//         result = this.categoryTranslation(cat.trim(),language);
//       } else {
//         result = result + ", " + this.categoryTranslation(cat.trim(),language);
//       }
//     }
//     return result;
//   }

//     /**
//    * Parses an array of categories to a string
//    * @param categories - array of categories to be parsed 
//    * @returns string with all categories on array 
//    *          by alphabetical order
//    */
//      parseCategories(categoriesArray: string[]): string{
//       let categories = "";
//       for (let cat of categoriesArray.sort((a, b) => (a > b) ? 1 : -1)){
//         categories = categories + "" + cat + ", ";
//       }
//       return categories.slice(0,-2);
//     }
// }


