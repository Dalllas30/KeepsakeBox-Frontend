import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { CategoryList } from '../models/category-list.model';
import { CategoryTranslation } from '../models/category-translation.model';

//Request URLs
//const serverURL = "194.117.20.219"
const serverURL = "localhost"
const getCategoriesURL = `http://${serverURL}:8080/categories?token=`
const getCategoriesTranslationsURL = `http://${serverURL}:8080/categories/translations?token=`




@Injectable({
  providedIn: 'root'
})
export class CategoryService implements OnInit {

  //All existing categories to identify images
  private categories: string[] = [];

  private categoriesRetrieved: boolean = false;
  private categoriesTranslationsRetrieved: boolean = false;

  private categoriesSize: Map<string, number> = new Map();

  private translationCategoriesList: Map<string, Map<string, string>> = new Map();

  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService) {
  }

  async ngOnInit(): Promise<void> {
    await this.getCategories();
  }

  async retrieveCategories(token: string): Promise<void>{
    this.categoriesRetrieved = true;

    await this.http.get<CategoryList>(`${getCategoriesURL}${token}`).toPromise()
    .then(response => {
      if (response) {
        this.categories = [];
        this.categoriesSize = new Map();
        response.categories.forEach( el => {
          const categoryName = el.name.toString();
          this.categories.push(categoryName);
          this.categoriesSize.set(categoryName, el.image_number);
        });
      }
    }).catch(error => {
      this.categoriesRetrieved = false;
    });
  }

  async retrieveCategoriesTranslations(token: string): Promise<void>{
    this.categoriesTranslationsRetrieved = true;

    await this.http.get<CategoryTranslation>(`${getCategoriesTranslationsURL}${token}`).toPromise()
    .then(response => {
      if (response) {
        this.translationCategoriesList = new Map();
        response.categories.forEach( el => {
          const trans = el.split(":");
          const category = trans[0];
          const language = trans[1];
          const translation = trans[2];

          if (!category || !language || translation === undefined) {
            return;
          }

          const categoryTranslations = this.translationCategoriesList.get(category) ?? new Map<string, string>();
          categoryTranslations.set(language, translation);
          this.translationCategoriesList.set(category, categoryTranslations);
        });
      }
    }).catch(error => {
      this.categoriesTranslationsRetrieved = false;
    });
  }

  /**
   * Gets all image existing categories
   * @returns list of all categories defined
   */
  async getCategories(): Promise<string[]>{
    // if (! this.categoriesRetrieved) {
      const token = this.authenticationService.getCurrentCaregiverToken();
      if (!token) {
        this.categoriesRetrieved = false;
        this.categoriesTranslationsRetrieved = false;
        return this.categories;
      }

      await this.retrieveCategories(token);
      await this.retrieveCategoriesTranslations(token);
    //}
    return this.categories;
  }

  categoryImagesNumber(category: string): number {
    return this.categoriesSize.get(category) ?? 0;
  }

  categoryTranslation(category: string, language: string): string {
    if (!this.categoriesRetrieved || !this.categoriesTranslationsRetrieved) {
      return "No category available yet"
    }

    const translatedCategory = this.translationCategoriesList.get(category)?.get(language);
    if (translatedCategory) {
      return translatedCategory;
    }

    return this.translationCategoriesList.get("Outra")?.get(language) ?? category;
  }

  categoriesTranslation(categoryList: string, language: string): string {
    var result: string = "";
    var categories = categoryList.split(",");
    for (let cat of categories) {
      if (result.length == 0) {
        result = this.categoryTranslation(cat.trim(),language);
      } else {
        result = result + ", " + this.categoryTranslation(cat.trim(),language);
      }
    }
    return result;
  }

    /**
   * Parses an array of categories to a string
   * @param categories - array of categories to be parsed 
   * @returns string with all categories on array 
   *          by alphabetical order
   */
     parseCategories(categoriesArray: string[]): string{
      let categories = "";
      for (let cat of categoriesArray.sort((a, b) => (a > b) ? 1 : -1)){
        categories = categories + "" + cat + ", ";
      }
      return categories.slice(0,-2);
    }
}


