/**
 * @author André Santana - fc49451
 * @author Pedro Neves - fc46430
 */

 import { Injectable } from '@angular/core';
 import { Router } from '@angular/router';
 import { BehaviorSubject } from 'rxjs';
 import { AppContext } from '../models/app-context.model';
 
 @Injectable({
   providedIn: 'root'
 })
 export class AppService {
 
   private appContext: BehaviorSubject<AppContext | null>;
   private pageStatus: BehaviorSubject<string | null>;
   private selectedCategories: BehaviorSubject<string[] | null>;
 
  constructor(private router: Router) {
    this.appContext = new BehaviorSubject<AppContext | null>(JSON.parse(localStorage.getItem('appContext') || 'null'));
    this.pageStatus = new BehaviorSubject<string | null>(JSON.parse(localStorage.getItem('pageStatus') || 'null'));
    this.selectedCategories = new BehaviorSubject<string[] | null>(JSON.parse(localStorage.getItem('selectedCategories') || 'null'));
  }
 
 /**
   * Sets the current Application Context on cache
   * @param appCtx - Application Context to save on cache
   */
  setAppContext(appCtx: AppContext): void {
   localStorage.setItem('appContext', JSON.stringify(appCtx));
   this.appContext.next(appCtx);
 }
 
 /**
  * Resets Application Context on cache
  */
 resetAppContext(): void {
   localStorage.removeItem('appContext');
   this.appContext.next(null);
 }
 
 /**
  * Gets Application Context saved on cache
  * @returns Application Context saved on cache
  */
 getAppContext(): AppContext | null {
   return this.appContext.value;
 }
 
 /**
   * Sets the current page status on cache
   * @param pstatus - page status to save on cache
   */
   setPageStatus(pstatus: string): void {
     localStorage.setItem('pageStatus', JSON.stringify(pstatus));
     this.pageStatus.next(pstatus);
   }
 
   /**
    * Resets page status on cache
    */
   resetPageStatus(): void {
     localStorage.removeItem('pageStatus');
     this.pageStatus.next(null);
   }
 
   /**
    * Gets page status saved on cache
    * @returns page status saved on cache
    */
   getPageStatus(): string | null {
     return this.pageStatus.value;
   }
 
   /**
   * Sets the current page status on cache
   * @param pstatus - page status to save on cache
   */
    setSelectedCategories(categories: string[]): void {
     localStorage.setItem('selectedCategories', JSON.stringify(categories));
     this.selectedCategories.next(categories);
   }
 
   /**
    * Resets page status on cache
    */
   resetSelectedCategories(): void {
     localStorage.removeItem('selectedCategories');
     this.selectedCategories.next(null);
   }
 
   /**
    * Gets page status saved on cache
    * @returns page status saved on cache
    */
   getSelectedCategories(): string[] {
     if (this.selectedCategories.value == null) {
       return [];
     } else {
       return this.selectedCategories.value;
     }
   }
   /**
    * Is route active?
    * @param route - route to check if is active
    * @returns TRUE if is the active route
    */
    public isRouteActive(route: string): boolean {
     return this.router.url.includes(`/${route}`);
   }
 
   /**
    * Converts a patient name for presentation on the application
    * @param displayName - patient display name (First priority)
    * @param name - patient name is used in case displayName is not defined
    *               consists on patient first and last name or only the first name
    * @returns converted name of the patient for presentation
    */
   convertPatientDisplayName(displayName: string, name: string): string {
 
     //Checks if it has displayName
     if (displayName != ""){
       return displayName;
     }else{
 
       //If not splits name and gets first (and last name)
       var nameSplitted = name.split(" ");
       if (nameSplitted.length == 1){
         var firstName = nameSplitted[0];
         return firstName;
       }else{
         var firstName = nameSplitted[0];
         var lastName = nameSplitted.pop();
         return firstName + " " + lastName;
       }
     }
   }
 
 }
 