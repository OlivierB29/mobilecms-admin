
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMainpageComponent } from './admin-mainpage.component';

describe('AdminMainpageComponent', () => {
  let component: AdminMainpageComponent;
  let fixture: ComponentFixture<AdminMainpageComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminMainpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMainpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
