import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPluginDataComponent } from './my-plugin-data.component';

describe('MyPluginDataComponent', () => {
  let component: MyPluginDataComponent;
  let fixture: ComponentFixture<MyPluginDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyPluginDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPluginDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
