export class Document {
  constructor(
    public id?: string,
    public created_date?: string,
    public updated_date?: string,
    public is_deleted?: number,
    public content?: string,
    public title?: string,
    public description?: string,
    public author?: string,
    public responsibleCode?: number,
    public announcementCode?: number,
    public fileInput?: FileList,
    public indexDoc?: number,
    
  ) { }
}