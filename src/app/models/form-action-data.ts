export class FormActionData {
    constructor(
        public reportId: number,
        public applicationTableId: number,
        public where: Where,
        public fieldsList: FieldListItem[]
    ){};
}

export class FieldListItem{
    constructor(
        public name: string,
        public value: string,
        public base64EncodedFile: string
    ){}
}

export class FieldListNumericValue{
    constructor(
        public name: string,
        public value: number,
        public base64EncodedFile: string
    ){}
}

export class Where{
    constructor(
        public rid: number
    ){}
}