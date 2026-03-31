/**
 * @author André Santana - fc49451
 */

import { Image } from "./image.model";

export class PersonalImage {
    constructor(
        public image: Image,
        public isFavorite: boolean,
        public associatedImageId?: string
    ){}
}
