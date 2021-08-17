export class Announcement {
    constructor(
        public id?: string,
        public created_date?: string,
        public updated_date?: string,
        public is_deleted?: number,
        public name?: number,
        public description?: string,
        public startDate?: string,
        public endDate?: string,
        public responsibleCode?: number,
        public entityCode?: number,

    ) { }
}