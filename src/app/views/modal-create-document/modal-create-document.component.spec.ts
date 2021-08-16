import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateDocumentComponent } from './modal-create-document.component';

describe('ModalCreateDocumentComponent', () => {
  let component: ModalCreateDocumentComponent;
  let fixture: ComponentFixture<ModalCreateDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCreateDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreateDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
