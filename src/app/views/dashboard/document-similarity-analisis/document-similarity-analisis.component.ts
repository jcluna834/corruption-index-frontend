import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-document-similarity-analisis',
  templateUrl: './document-similarity-analisis.component.html',
  styleUrls: ['./document-similarity-analisis.component.css']
})
export class DocumentSimilarityAnalisisComponent implements OnInit {

  private routeSub: Subscription;
  
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log("inicio");
    this.routeSub = this.route.params.subscribe(params => {
      console.log(params) //log the entire params object
      console.log(params['id']) //log the value of id
    });
  }
  
  cancel(){
    console.log("cancelar");
  }

}
