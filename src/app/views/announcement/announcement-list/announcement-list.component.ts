import { Component, OnInit, ViewChild } from '@angular/core';
import { PlagiarismDetectionManagerService } from './../../../services/managers/plagiarism-detection.manager';
import { ModalCreateAnnouncementComponent } from './../../../views/announcement/modal-create-announcement/modal-create-announcement.component';

@Component({
  selector: 'app-announcement-list',
  templateUrl: './announcement-list.component.html',
  styleUrls: ['./announcement-list.component.css']
})
export class AnnouncementListComponent implements OnInit {

  @ViewChild('modalCreateAnnouncement', { static: false })
  modalCreateAnnouncement: ModalCreateAnnouncementComponent;

  constructor(private plagiarismDetectionService: PlagiarismDetectionManagerService) { }

  public docsItems: any;

  ngOnInit(): void {
    this.getAnnouncements();
  }

  async getAnnouncements(){
    const lstReports = await this.plagiarismDetectionService.getAnnouncement();
    if(lstReports){
      this.docsItems = lstReports.data.data.map(x =>{
        return{
          id: x.id,
          name: x.name,
          description: x.description,
          startDate: x.startDate,
          endDate: x.endDate,
          selected: false,
        }
      })
    }
  }

  addAnnouncement(){
    this.modalCreateAnnouncement.showModal();
  }

}
