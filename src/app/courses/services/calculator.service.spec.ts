import { TestBed } from "@angular/core/testing";
import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";


describe('CalculatorService', () => { // adprefix x - to disable / f - to focus only this suite

  let calculator: CalculatorService;
  let loggerSpy: any;

  beforeEach(() => {
    loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);

    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        { provide: LoggerService, useValue: loggerSpy }
      ]
    });

    calculator = TestBed.get(CalculatorService);
  });

  it('should add two number', () => {
    loggerSpy.log.and.returnValue(2);

    const result = calculator.add(2, 2);

    expect(result).toBe(4);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  it('should substract two number', () => {
    const result = calculator.subtract(2, 2);

    expect(result).toBe(0, 'unexpected substraction');
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  xit('should substract two number', () => { // adprefix x - to disable / f - to focus only this test
    const result = calculator.subtract(2, 2);

    expect(result).toBe(0, 'unexpected substraction');
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

});

