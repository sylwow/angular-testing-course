import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";
import { click, sleep } from "../common/test-utils";


describe('async example', () => {

  it('async done', (done: DoneFn) => {

    let test = false;


    setTimeout(() => {

      test = true;

      expect(test).toBeTruthy();
      done();
    }, 1000);

  });

  it('async tick', fakeAsync(() => {

    let test = false;

    setTimeout(() => {
      test = true;
    }, 1000);

    tick(1000); // move clock

    expect(test).toBeTruthy();

  }));

  it('async flush', fakeAsync(() => {

    let test = false;

    setTimeout(() => {
      test = true;
    }, 1000);

    flush(); // move clock to finish all auto

    expect(test).toBeTruthy();

  }));

  it('async plain promise', fakeAsync(() => {

    let test = false;

    Promise.resolve().then(() => {

      return Promise.resolve();
    }).then(() => {
      test = true;
    });

    flushMicrotasks(); // flush promise queue microtasks

    expect(test).toBeTruthy();
  }));

  it('async promise + setTimeout', fakeAsync(() => {

    let counter = 0;

    Promise.resolve().then(() => {
      counter++;

      setTimeout(() => {
        counter++
      }, 1000);
      return Promise.resolve();
    }).then(() => {
      counter++;
    });


    expect(counter).toBe(0);

    flushMicrotasks(); // flush promise queue microtasks

    expect(counter).toBe(2);

    tick(500);

    expect(counter).toBe(2);

    tick(500);

    expect(counter).toBe(3);
  }));

  it('async observables', fakeAsync(() => {
    let flag = false;

    const test$ = of(flag).pipe(delay(200));

    test$.subscribe(() => {
      flag = true;
    })

    tick(200);

    expect(flag).toBeTruthy();

  }));
});
