export class PasswordRecoveryData {
    constructor(
        public email: string,
        public clientLocation: string,
        public newPassword: string,
        public recoveryCode: string,
    ){};
}