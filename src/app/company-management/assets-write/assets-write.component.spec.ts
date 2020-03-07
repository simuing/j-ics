import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsWriteComponent } from './assets-write.component';

describe('AssetsWriteComponent', () => {
  let component: AssetsWriteComponent;
  let fixture: ComponentFixture<AssetsWriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetsWriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsWriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
