import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileUpload } from './profile-upload';

describe('ProfileUpload', () => {
  let component: ProfileUpload;
  let fixture: ComponentFixture<ProfileUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileUpload);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
