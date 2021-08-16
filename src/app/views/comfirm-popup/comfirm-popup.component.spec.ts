import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComfirmPopupComponent } from './comfirm-popup.component';

describe('ComfirmPopupComponent', () => {
  let component: ComfirmPopupComponent;
  let fixture: ComponentFixture<ComfirmPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComfirmPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComfirmPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
