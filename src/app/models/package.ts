export class PackageJob {
    constructor(
        public ApplicationId : Number,
        public DocumentFieldId : Number,
        public ParentIdFieldId : Number,
        public ParentId : Number,
        public Queued: Boolean,
        public LastRun: Number,
        public DocumentType : String
    ){};
};