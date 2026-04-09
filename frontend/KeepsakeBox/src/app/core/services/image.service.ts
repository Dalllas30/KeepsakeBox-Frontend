/**
 * @author André Santana - fc49451
 * @author Pedro Neves - fc46430
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { Observable } from 'rxjs';
import { AddImageData } from '../models/add-image-data.model';
import { Request, Thumbnail } from '../models/image.model';
import { ImagesFilterData } from '../models/images-filter-data.model';
import { PersonalImageList } from '../models/personal-image-list.model';
import { PersonalImage } from '../models/personal-image.model';
import { AppService } from './app.service';

//Request URLs
//const serverURL = "194.117.20.219"
const serverURL = "localhost"
const addPatientImageURL01 = `http://${serverURL}:8080/patient/image/personal?token=`;
const addPatientImageURL02 = '&patientId=';
const addCaregiverImageURL = `http://${serverURL}:8080/caregiver/image/personal?token=`;
const getPatientImageURL01 = `http://${serverURL}:8080/patient/image/personal?token=`;
const getPatientImageURL02 = '&patientId=';
const getPatientImageURL03 = '&imageId=';
const getImagesByCategoryURL = `http://${serverURL}:8080/images?token=`;
const getSessionPatientImagesURL01 = `http://${serverURL}:8080/patient/images/session?token=`;
const getSessionPatientImagesURL02 = '&patientId=';
const getSessionPatientImagesURL03 = '&direction=';
const getCaregiverImageURL01 = `http://${serverURL}:8080/caregiver/image/personal?token=`;
const getCaregiverImageURL02 = '&imageId=';
const getPatientImagesURL01 = `http://${serverURL}:8080/patient/images/personal?token=`;
const getPatientImagesURL02 = '&patientId=';
const getCaregiverImagesURL = `http://${serverURL}:8080/caregiver/images/personal?token=`;
const updatePatientImageURL01 = `http://${serverURL}:8080/patient/image/personal/update?token=`;
const updatePatientImageURL02 = '&patientId=';
const updateCaregiverImageURL = `http://${serverURL}:8080/caregiver/image/personal/update?token=`;
const deletePatientImageURL01 = `http://${serverURL}:8080/patient/image/personal/delete?token=`;
const deletePatientImageURL02 = '&patientId=';
const deletePatientImageURL03 = '&imageId=';
const deleteCaregiverImageURL01 = `http://${serverURL}:8080/caregiver/image/personal/delete?token=`;
const deleteCaregiverImageURL02 = '&imageId=';
const getThumbnailURL = `http://${serverURL}:8080/thumbnail/id`

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  //All existing categories to identify images
  private categoriesPT: string[] =
    ["Animais", "Comida", "Empregos", "Locais", "Pessoas", "Veículos", "Hábitos",
      "Música", "Cinema", "Desportos", "Objetos", "Passatempos", "Férias", "Natureza"]
      .sort((a, b) => (a > b) ? 1 : -1);

  private categoriesENG: string[] =
    ["Animals", "Food", "Jobs", "Places", "People", "Vehicles", "Habits",
      "Music", "Cinema", "Sports", "Objects", "Hobbies", "Vacations", "Nature"]
      .sort((a, b) => (a > b) ? 1 : -1);

  //Images URL to add and associate to patient/caregiver
  private imagesURL: string[] = [];

  //Images URL to add and associate to patient/caregiver
  private imagesToValidateURL: string[] = [];

  //Service constructor
  constructor(private http: HttpClient,
    private router: Router,
    private ng2ImgMaxService: Ng2ImgMaxService,
    private appService: AppService) {
    this.categoriesPT.push("Outra")
    this.categoriesENG.push("Other")
  }

  async getThumbnail(imageId: string): Promise<Thumbnail | null> {
    let thumbnail: Thumbnail | null = null;
    await this.http.post<Thumbnail>(getThumbnailURL, imageId).toPromise().then(response => {
      if (response) {
        thumbnail = response;
      }
    });
    return thumbnail;
  }

  /**
   * Gets all image existing categories
   * @returns list of all categories defined
   */
  async getCategories(): Promise<string[]> {
    return this.categoriesPT;
  }
  getCategoriesPT(): string[] {
    return this.categoriesPT;
  }
  getCategoriesENG(): string[] {
    return this.categoriesENG;
  }

  /**
   * Parses an array of categories to a string
   * @param categories - array of categories to be parsed 
   * @returns string with all categories on array 
   *          by alphabetical order
   */
  parseCategories(categoriesArray: string[]): string {
    let categories = "";
    for (let cat of categoriesArray.sort((a, b) => (a > b) ? 1 : -1)) {
      categories = categories + "" + cat + ", ";
    }
    return categories.slice(0, -2);
  }

  /**
   * Appendds a new imageURL to update
   * @param imageURL - imageURL to append
   */
  pushImageURL(imageURL: string) {
    this.imagesURL.push(imageURL);
  }

  /**
   * Appendds a new imageURL to update
   * @param imageURL - imageURL to append
   */
  pushImageToValidateURL(imageURL: string) {
    this.imagesToValidateURL.push(imageURL);
  }

  /**
   * Retrieves the imageURL to update on top
   * @returns imageURL presented on top of the stack
   */
  popImageURL(): string {
    return this.imagesURL.pop() || '';
  }

  /**
   * Retrieves the imageURL to update on top
   * @returns imageURL presented on top of the stack
   */
  popImageToValidateURL(): string {
    return this.imagesToValidateURL.pop() || '';
  }

  /**
   * Resets imagesURL for update
   */
  resetImagesURL(): void {
    this.imagesURL = [];
  }

  /**
   * Resets imagesURL for update
   */
  resetImagesToValidateURL(): void {
    this.imagesToValidateURL = [];
  }

  /**
   * Saves all image URLs for upload
   * @param files - all image files to be converted to image URLs
   */
  async addImagesURLToUpload(files: any[]): Promise<void> {

    console.log(files)
    //Gets amount of images for update
    let filesAmount = files.length;

    //List all images for update
    for (let file of files) {
      //Resize Image
      await this.ng2ImgMaxService.resizeImage(file, 1000, 1000).subscribe(
        result => {
          let imageFile = result as Blob;

          //Transform File in data URL
          let reader = new FileReader();
          reader.readAsDataURL(imageFile);
          reader.onload = async (event) => {
            if (event.target) {
              console.log(event.target.result);

              if (typeof event.target.result === 'string') {
                  this.pushImageURL(event.target.result);
                } else if (event.target.result) {
                  this.pushImageURL(event.target.result.toString());
                }
            }

            //Router navigates after first image added
            if (this.appService.isRouteActive('caregiver/person/images')) {
              this.router.navigateByUrl('/caregiver/person/images/add', {
                state: { imagesAmount: filesAmount }
              });
            } else {
              this.router.navigateByUrl('/caregiver/profile/images/add', {
                state: { imagesAmount: filesAmount }
              });
            }
          };
        },
        error => {
          console.log('Error resizing Profile Image!', error);
        }
      );
    }
  }

  /**
   * Saves all image URLs for upload and sends them to validation
   * @param files - all image files to be converted to image URLs
   */
  addImagesURLToUploadForValidation(files: any[], request: Request): Promise<void> {
    void request;

    //Gets amount of images for update
    let filesAmount = files.length;

    const uploadPromises: Promise<void>[] = [];

    //List all images for update
    for (let file of files) {
      //Resize Image
      const uploadPromise = new Promise<void>((resolve, reject) => {
        this.ng2ImgMaxService.resizeImage(file, 1000, 1000).subscribe(
          result => {
            let imageFile = result as Blob;

            //Transform File in data URL
            let reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = (event) => {
              if (typeof event.target?.result === 'string') {
                this.pushImageToValidateURL(event.target.result);
              } else if (event.target?.result) {
                this.pushImageToValidateURL(event.target.result.toString());
              }

              resolve();
            };
            reader.onerror = () => reject();
          },
          error => {
            console.log('Error resizing Profile Image!', error);
            reject(error);
          }
        );
      });

      uploadPromises.push(uploadPromise);
    }

    return Promise.all(uploadPromises).then(() => undefined);
  }

  /**
   * Add a new patient application image 
   * @param token - current logged caregiver token
   * @param patientId - ID of the patient to associate image to
   * @param addImageData - all data needed to add a new image to the database
   * @returns TRUE if the observation was added and FALSE if not
   */
  async addPatientImage(token: string, patientId: string,
    addImageData: AddImageData): Promise<boolean> {
    let imageAdded = true;
    await this.http.post(
      `${addPatientImageURL01}${token}${addPatientImageURL02}${patientId}`,
      addImageData).toPromise()
      .catch(error => {
        imageAdded = false;
      });
    return imageAdded;
  }

  /**
   * Add a new patient application image 
   * @param token - current logged caregiver token
   * @param addImageData - all data needed to add a new image to the database
   * @returns TRUE if the observation was added and FALSE if not
   */
  async addCaregiverImage(token: string,
    addImageData: AddImageData): Promise<boolean> {
    let imageAdded = true;
    await this.http.post(
      `${addCaregiverImageURL}${token}`,
      addImageData).toPromise()
      .catch(error => {
        imageAdded = false;
      });
    return imageAdded;
  }

  /**
   * Gets all application images associated to the patient with the given ID
   * @param token - current logged caregiver token
   * @param patientId - ID of the patient to get images from
   * @returns list with all PersonalImage that belongs to the patient
   */
  async getPatientImages(token: string, patientId: String): Promise<PersonalImage[]> {
    let images: PersonalImage[] = [];
    await this.http.get<PersonalImageList>(
      `${getPatientImagesURL01}${token}${getPatientImagesURL02}${patientId}`)
      .toPromise()
      .then(response => {
        if (response) {
          images = response.images.sort((a, b) =>
            (a.image.lastUpdatedDate < b.image.lastUpdatedDate) ? 1 : -1);
        }
      });

    await Promise.all(images.map(async element => {
      element.image.thumbnailPath = await this.getThumbnailPath(element.image.id);
    }));
    
    return images;
  }

  /**
    * Gets all application images associated to a category with the given Filters
    * @param token - current logged caregiver token
    * @param imageFilterData - all data needed to filter the list in the database
    * @returns list with all PersonalImage that match the filter data
    */
  async getImagesByCategory(token: string, imagesFilterData: ImagesFilterData): Promise<PersonalImage[]> {
    let images: PersonalImage[] = [];
    await this.http.post<PersonalImageList>(
      `${getImagesByCategoryURL}${token}`,
      imagesFilterData)
      .toPromise()
      .then(response => {
        if (response) {
          images = response.images.sort((a, b) =>
            (a.image.lastUpdatedDate < b.image.lastUpdatedDate) ? 1 : -1);
        }
      });
    return images;
  }

  /**
   * Gets all application images associated to the patient with the given ID   ============= # Pedro Para apagar
   * @param token - current logged caregiver token
   * @param patientId - ID of the patient to get images from
   * @returns list with all PersonalImage that belongs to the patient
   */
  async getSessionPatientImage(token: string, patientId: String, direction: String): Promise<PersonalImage[]> {
    let images: PersonalImage[] = [];
    await this.http.get<PersonalImageList>(
      `${getSessionPatientImagesURL01}${token}${getSessionPatientImagesURL02}${patientId}${getSessionPatientImagesURL03}${direction}`)
      .toPromise()
      .then(response => {
        if (response) {
          images = response.images.sort((a, b) =>
            (a.image.lastUpdatedDate < b.image.lastUpdatedDate) ? 1 : -1);
        }
      });
    return images;
  }

  /**
   * Gets all application images associated to the caregiver with the given token
   * @param token - current logged caregiver token
   * @returns list with all PersonalImage that belongs to the patient
   */
  async getCaregiverImages(token: string): Promise<PersonalImage[]> {
    let images: PersonalImage[] = [];
    await this.http.get<PersonalImageList>(
      `${getCaregiverImagesURL}${token}`)
      .toPromise()
      .then(response => {
        if (response) {
          images = response.images.sort((a, b) =>
            (a.image.lastUpdatedDate < b.image.lastUpdatedDate) ? 1 : -1);
        }
      });

    await Promise.all(images.map(async element => {
      element.image.thumbnailPath = await this.getThumbnailPath(element.image.id);
    }));

    return images;
  }

  /**
   * Retrieves a thumbnail of an image
   * @param imageId id of the image
   */
  async getThumbnailPath(imageId: string): Promise<string> {
    let thumbnail = await this.getThumbnail(imageId);
    console.log(thumbnail);

    return thumbnail?.imagePath || '';
  }

  /**
   * Gets a Patient Image with given patientId and imageId
   * @param token - current logged caregiver token
   * @param patientId - ID of the patient associated to the image
   * @param imageId - ID of the image associated to the patient
   * @returns PersonalImage associated to patient with given ID
   *          and with given image ID
   */
  async getPatientImage(token: string, patientId: String, imageId: string): Promise<PersonalImage | null> {
    let image: PersonalImage | null = null;
    await this.http.get<PersonalImage>(
      `${getPatientImageURL01}${token}${getPatientImageURL02}${patientId}${getPatientImageURL03}${imageId}`)
      .toPromise()
      .then(response => {
        if (response) {
          image = response;
        }
      });
    return image;
  }

  /**
   * Gets a Caregiver Image with given token and imageId
   * @param token - current logged caregiver token
   * @param imageId - ID of the image associated to the patient
   * @returns PersonalImage associated to patient with given ID
   *          and with given image ID
   */
  async getCaregiverImage(token: string, imageId: string): Promise<PersonalImage | null> {
    let image: PersonalImage | null = null;
    await this.http.get<PersonalImage>(
      `${getCaregiverImageURL01}${token}${getCaregiverImageURL02}${imageId}`)
      .toPromise()
      .then(response => {
        if (response) {
          image = response;
        }
      });
    return image;
  }

  /**
   * Updates a patient image with given details and patient ID
   * @param token - current logged caregiver token
   * @param patientId - ID associated to the patient which has the image for update
   * @param img - image data for update
   * @returns TRUE if image was updated successfully
   */
  async updatePatientImage(token: string, patientId: String, img: PersonalImage): Promise<boolean> {
    let imageUpdated = true;
    await this.http.post(
      `${updatePatientImageURL01}${token}${updatePatientImageURL02}${patientId}`, img).toPromise()
      .catch(error => {
        imageUpdated = false;
      });
    return imageUpdated;
  }

  /**
   * Updates a caregiver image with given details and caregiver token
   * @param token - current logged caregiver token
   * @param img - image data for update
   * @returns TRUE if image was updated successfully
   */
  async updateCaregiverImage(token: string, img: PersonalImage): Promise<boolean> {
    let imageUpdated = true;
    await this.http.post(
      `${updateCaregiverImageURL}${token}`, img).toPromise()
      .catch(error => {
        imageUpdated = false;
      });
    return imageUpdated;
  }

  /**
   * Deletes a patient image with given details and patient and image IDs
   * @param token - current logged caregiver token
   * @param patientId - ID associated to the patient which has the image for update
   * @param imageId - ID of the image to be deleted
   * @returns TRUE if image was deleted successfully
   */
  async deletePatientImage(token: string, patientId: String, imageId: String): Promise<boolean> {
    let imageDeleted = true;
    await this.http.get(
      `${deletePatientImageURL01}${token}${deletePatientImageURL02}${patientId}${deletePatientImageURL03}${imageId}`).toPromise()
      .catch(error => {
        imageDeleted = false;
      });
    return imageDeleted;
  }

  /**
   * Deletes a caregiver image with given details and patient and image IDs
   * @param token - current logged caregiver token
   * @param imageId - ID of the image to be deleted
   * @returns TRUE if image was deleted successfully
   */
  async deleteCaregiverImage(token: string, imageId: String): Promise<boolean> {
    let imageDeleted = true;
    await this.http.get(
      `${deleteCaregiverImageURL01}${token}${deleteCaregiverImageURL02}${imageId}`).toPromise()
      .catch(error => {
        imageDeleted = false;
      });
    return imageDeleted;
  }
}
