import { Image } from "./image.model";

export class RtSessionCreateData {
    constructor(
        public id:string,
        public image: Image,
        public favorite: boolean,
        public isFavorite: boolean
    ) {}
}
