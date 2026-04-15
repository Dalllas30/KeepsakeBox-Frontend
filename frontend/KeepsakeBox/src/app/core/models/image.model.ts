/**
 * @author André Santana - fc49451
 */

import { SimpleCaregiver } from "./simple-caregiver.model";

export class Image {
    constructor(
        public id: string,
        public createdById: String,
        public createdBy: SimpleCaregiver,
        public category: string,
        public description: string,
        public isPersonal: boolean,
        public isPrivate: boolean,
        public imageURL: string,
        public negativeIntensity: number,
        public neutralIntensity: number,
        public positiveIntensity: number,
        public createdDate: Date | null,
        public lastUpdatedDate: Date | null,
        public thumbnailPath?: string,
    ){}
}

export interface FoundImage {
    imagePath: string;
    acceptance: boolean;
}

export interface FormObject {
    tags: string;
    tag_mode: string;
    text: string;
    sort: number;
    per_page: number;
    page: number;
}

export interface Request {
    id: string,
    expirationDate: string,
    caregiverID: string,
    targetID: string,
}

export interface ImageToValidate {
    id: string,
    caregiverID: string,
    targetID: string,
    category: string,
    description: string,
    imagePath: string,
    submissionDate: string,
    username: string,
    isPrivate: boolean,
}

export interface ImageGroup {
    imagesToValidate: ImageToValidate[],
    username: string,
    submissionDate: string,
}


export class ImageToValidateData {
    constructor(
        public caregiverID: string,
        public targetID: string,
        public category: string,
        public description: string,
        public imagePath: string,
        public submissionDate: string,
        public username: string,
        public isPrivate: boolean,
    ){}
}

export class Thumbnail {
    constructor(
        public id: string,
        public imageId: string,
        public imagePath: string,
    ){}
}