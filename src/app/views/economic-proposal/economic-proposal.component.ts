import { Component, OnInit, ViewChild } from '@angular/core';
import { EconomicProposalListComponent } from './economic-proposal-list/economic-proposal-list.component';

@Component({
  selector: 'app-economic-proposal',
  templateUrl: './economic-proposal.component.html'
})
export class EconomicProposalComponent implements OnInit {

  @ViewChild('economicProposalList', { static: false })
  economicProposalList: EconomicProposalListComponent;

  constructor() { }

  ngOnInit(): void {
  }

}
