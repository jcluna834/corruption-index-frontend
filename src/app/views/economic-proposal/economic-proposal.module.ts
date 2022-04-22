import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { AlertModule } from 'ngx-bootstrap/alert';

import { EconomicProposalComponent } from './economic-proposal.component';
import { EconomicProposalRoutingModule } from './economic-proposal-routing.module';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalCreateEconomicProposalComponent } from './modal-create-economic-proposal/modal-create-economic-proposal.component';
import { EconomicProposalListComponent } from './economic-proposal-list/economic-proposal-list.component';
import { AnnouncementModule } from './../announcement/announcement.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BidRiggingAnalisisComponent } from './economic-bidRigging-analisis/economic-bidRigging-analisis.component';
import { ModalBidRiggingAnalisisListComponent } from './modal-bidRigging-analisis-list/modal-bidRigging-analisis-list.component';

@NgModule({
  imports: [
    FormsModule,
    EconomicProposalRoutingModule,
    ChartsModule,
    BsDropdownModule,
    CommonModule,
    ButtonsModule.forRoot(),
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    ReactiveFormsModule,
    AnnouncementModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  declarations: [ 
    EconomicProposalComponent, 
    ModalCreateEconomicProposalComponent, 
    EconomicProposalListComponent,
    BidRiggingAnalisisComponent, 
    ModalBidRiggingAnalisisListComponent,
  ],
  exports : [
    ModalCreateEconomicProposalComponent, 
    EconomicProposalListComponent,
    BidRiggingAnalisisComponent
  ]
})
export class EconomicProposalModule { }
