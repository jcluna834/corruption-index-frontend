import { Component, OnInit, ViewChild } from '@angular/core';
import { EconomicProposalListComponent } from './economic-proposal-list/economic-proposal-list.component';
import { PlagiarismDetectionManagerService } from './../../services/managers/plagiarism-detection.manager';

@Component({
  selector: 'app-economic-proposal',
  templateUrl: './economic-proposal.component.html'
})
export class EconomicProposalComponent implements OnInit {

  @ViewChild('economicProposalList', { static: false })
  economicProposalList: EconomicProposalListComponent;

  public announcementItems: any;

  constructor(
    private plagiarismDetectionService: PlagiarismDetectionManagerService) { }

  ngOnInit(): void {
    this.getAnnouncements();
  }

  async getAnnouncements(){
    const lstReports = await this.plagiarismDetectionService.getAnnouncement();
    if(lstReports){
      this.announcementItems = lstReports.data.data.map(x =>{
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

  onChangeAnnouncement(announcementId) {
    if(announcementId){
      this.economicProposalList.showList = true
      this.economicProposalList.setAnnouncementCode(announcementId)
      this.economicProposalList.getDocuments()
    }
  }

}
