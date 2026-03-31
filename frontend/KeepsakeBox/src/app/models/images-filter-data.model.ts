/**
 * @author Pedro Neves - fc46430
 */

export class ImagesFilterData {

    constructor(
        public caregiverId: string,
        public patientId: string,
        public category: string,
        public allPublicImage: boolean,
        public myImageAll: boolean,
        public myImagePrivate:boolean,
        public myImageFavorite:boolean,
        public patientImageAll:boolean,
        public patientImagePrivate:boolean,
        public patientImageFavorite:boolean,
        public description: string,
        public pageSize: number,
        public maxSize: number,
        public page: number,
        public countedImages:number
    ){}
}