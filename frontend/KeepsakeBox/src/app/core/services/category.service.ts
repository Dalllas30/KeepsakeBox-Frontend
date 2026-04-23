import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { CategoryList } from '../models/category-list.model';
import { CategoryTranslation } from '../models/category-translation.model';
import { environment } from '../../../environments/environment';




@Injectable({
  providedIn: 'root'
})
export class CategoryService implements OnInit {

  //All existing categories to identify images
  private categories: string[] = [];
  private readonly categoriesPT: string[] = ['Animais', 'Comida', 'Empregos', 'Locais', 'Pessoas', 'Veículos', 'Hábitos', 'Música', 'Cinema', 'Desportos', 'Objetos', 'Passatempos', 'Férias', 'Natureza', 'Outra'];
  private readonly categoriesENG: string[] = ['Animals', 'Food', 'Jobs', 'Places', 'People', 'Vehicles', 'Habits', 'Music', 'Cinema', 'Sports', 'Objects', 'Hobbies', 'Vacations', 'Nature', 'Other'];

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

    await this.http.get<any[]>(`${environment.apiUrl}/images`).toPromise()
    .then(response => {
      if (response && response.length > 0) {
        this.categories = [];
        this.categoriesSize = new Map();
        const counts = new Map<string, number>();
        response.forEach((image: any) => {
          const categoryName = (image.image?.category ?? image.category ?? '').toString();
          if (!categoryName) {
            return;
          }
          counts.set(categoryName, (counts.get(categoryName) ?? 0) + 1);
        });
        this.categories = Array.from(counts.keys()).sort((a, b) => (a > b) ? 1 : -1);
        this.categories.forEach(category => this.categoriesSize.set(category, counts.get(category) ?? 0));
      } else {
        // Fallback: use predefined categories when no images exist
        this.categories = this.categoriesPT;
        this.categoriesSize = new Map();
      }
    }).catch(error => {
      // Fallback: use predefined categories on error
      this.categories = this.categoriesPT;
      this.categoriesSize = new Map();
      this.categoriesRetrieved = false;
    });
  }

  async retrieveCategoriesTranslations(token: string): Promise<void>{
    this.categoriesTranslationsRetrieved = true;

    try {
      this.translationCategoriesList = new Map();
      this.categoriesPT.forEach((category: string, index: number) => {
        const english = this.categoriesENG[index] ?? category;
        this.translationCategoriesList.set(category, new Map<string, string>([['pt', category], ['en', english]]));
        this.translationCategoriesList.set(english, new Map<string, string>([['pt', category], ['en', english]]));
      });
    } catch (error) {
      this.categoriesTranslationsRetrieved = false;
    }
  }

  /**
   * Gets all image existing categories
   * @returns list of all categories defined
   */
  async getCategories(): Promise<string[]>{
    const token = this.authenticationService.getCurrentCaregiverToken();
    if (!token) {
      this.categoriesRetrieved = false;
      this.categoriesTranslationsRetrieved = false;
      return this.categoriesPT; // Return predefined categories as fallback
    }

    await this.retrieveCategories(token);
    await this.retrieveCategoriesTranslations(token);
    
    // Ensure we always return something
    return this.categories && this.categories.length > 0 ? this.categories : this.categoriesPT;
  }

  categoryImagesNumber(category: string): number {
    return this.categoriesSize.get(category) ?? 0;
  }

  categoryTranslation(category: string, language: string): string {
    // Always have translations available (pre-initialized in constructor logic)
    const translatedCategory = this.translationCategoriesList.get(category)?.get(language);
    if (translatedCategory) {
      return translatedCategory;
    }

    // Default to "Other" if category not found
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


