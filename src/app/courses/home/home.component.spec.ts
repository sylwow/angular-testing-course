import { async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { CoursesModule } from '../courses.module';
import { DebugElement } from '@angular/core';

import { HomeComponent } from './home.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoursesService } from '../services/courses.service';
import { HttpClient } from '@angular/common/http';
import { COURSES } from '../../../../server/db-data';
import { setupCourses } from '../common/setup-test-data';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { click, sleep } from '../common/test-utils';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { delay, timeout } from 'rxjs/operators';




describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;

  beforeEach(async () => {

    const coursesServiceMoq = jasmine.createSpyObj<CoursesService>('CoursesService', ['findAllCourses']);

    await TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: CoursesService, useValue: coursesServiceMoq }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    coursesService = TestBed.get(CoursesService);

  });

  it("should create the component", () => {

    expect(component).toBeTruthy();

  });


  it("should display only beginner courses", () => {

    coursesService.findAllCourses.and.returnValue(of(setupCourses().filter(c => c.category === 'BEGINNER')));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(1);
  });



  it("should display only advanced courses", () => {

    coursesService.findAllCourses.and.returnValue(of(setupCourses().filter(c => c.category === 'ADVANCED')));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(1);

  });


  it("should display both tabs", () => {

    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(2);

  });


  it("should display advanced courses when tab clicked fakeAsync", fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    click(tabs[1]);//.nativeElement.click();

    fixture.detectChanges();

    flush();

    const firstCourseTitle = el.query(By.css('.mat-tab-body-active .mat-card-title'));

    expect(firstCourseTitle.nativeElement.textContent).toContain('Angular Security Course');

  }));

  it("should display advanced courses when tab clicked async", async () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    click(tabs[1]);//.nativeElement.click();

    fixture.detectChanges();

    await sleep(1000);

    const firstCourseTitle = el.query(By.css('.mat-tab-body-active .mat-card-title'));

    expect(firstCourseTitle.nativeElement.textContent).toContain('Angular Security Course');

  });

});


