export class CommonPhrase {
    constructor(
        public id?: number,
        public created_date?: string,
        public updated_date?: string,
        public is_deleted?: number,
        public description?: string,
        public phrase?: number,
        public announcementCode?: number,
    ) { }
}