/**
 * @author André Santana - fc49451
 */

export class AddImageData {
    constructor(
        public category: string,
        public description: string,
        public imageURL: string,
        public createdById: string,
        public isPrivate: boolean,
        public isFavorite: boolean
    ){}
}
