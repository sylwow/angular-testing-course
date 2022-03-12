import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { COURSES, findLessonsForCourse, LESSONS } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe('CoursesService', () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CoursesService
      ]
    });

    coursesService = TestBed.get(CoursesService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should retrieve all courses', () => {

    coursesService.findAllCourses().subscribe(courses => {

      expect(courses).toBeTruthy('no courses returned');
      expect(courses.length).toBe(12);

      const course = courses.find(course => course.id == 12);

      expect(course.titles.description).toBe('Angular Testing Course');
    });

    const req = httpTestingController.expectOne('/api/courses');

    expect(req.request.method).toEqual('GET');

    req.flush({
      payload: Object.values(COURSES)
    })

  });

  it('should retrieve course by id', () => {

    coursesService.findCourseById(12).subscribe(course => {

      expect(course).toBeTruthy('no course returned');
      expect(course.id).toBe(12);

      expect(course.titles.description).toBe('Angular Testing Course');
    });

    const req = httpTestingController.expectOne('/api/courses/12');

    expect(req.request.method).toEqual('GET');

    req.flush(COURSES[12])

  });

  it('should save course', () => {

    const changes: Partial<Course> = { titles: { description: 'TEST' } };
    coursesService.saveCourse(12, changes).subscribe(course => {

      expect(course.id).toBe(12);
    });

    const req = httpTestingController.expectOne('/api/courses/12');

    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(changes);

    req.flush({ ...COURSES[12], ...changes })

  });

  it('should fail save course', () => {

    const changes: Partial<Course> = { titles: { description: 'TEST' } };
    coursesService.saveCourse(12, changes).subscribe({
      next: course => {
        fail('save course should failed')
      },
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(500)
      }
    });

    const req = httpTestingController.expectOne('/api/courses/12');

    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(changes);

    req.flush('Save course fail', { status: 500, statusText: 'server error' });
  });

  it('should find lessons', () => {

    coursesService.findLessons(12).subscribe(lessons => {
      expect(lessons).toBeTruthy();
      expect(lessons.length).toBe(3);
    });

    const req = httpTestingController.expectOne(req => req.url == '/api/lessons');

    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('courseId')).toEqual('12');
    expect(req.request.params.get('filter')).toEqual('');
    expect(req.request.params.get('sortOrder')).toEqual('asc');
    expect(req.request.params.get('pageNumber')).toEqual('0');
    expect(req.request.params.get('pageSize')).toEqual('3');

    req.flush({
      payload: findLessonsForCourse(12).slice(0, 3)
    });
  });

  afterEach(() => {
    httpTestingController.verify(); // only one req performed
  })
});
