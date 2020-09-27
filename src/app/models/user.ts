export class User {
    constructor(
        public access_token: string,
        public expires: Date,
        public userName: string,
        public fullName: string
    ){}

    tokenIsValid():boolean{
        return new Date() < this.expires;
    }
}
