import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ForecastService } from './forecast.service';

describe('ForecastService', () => {
  let service: ForecastService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ForecastService, provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(ForecastService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should call forecast endpoint', () => {
    service.getForecast().subscribe(response => {
      expect(response.metrics.finalBalance).toBe(100);
    });

    const req = httpMock.expectOne('http://localhost:5000/api/forecast');
    expect(req.request.method).toBe('GET');
    req.flush({ timeline: [], metrics: { minBalance: 80, negativeDays: 0, finalBalance: 100 }, goals: [] });
  });

  it('should call simulate endpoint with from/to query params', () => {
    service.simulate({ amount: 300, date: '2026-02-06', type: 'EXPENSE' }, '2026-02-01', '2026-03-02').subscribe(response => {
      expect(response.minBalanceDelta).toBe(-300);
    });

    const req = httpMock.expectOne(r =>
      r.url === 'http://localhost:5000/api/simulate' &&
      r.params.get('from') === '2026-02-01' &&
      r.params.get('to') === '2026-03-02');

    expect(req.request.method).toBe('POST');
    expect(req.request.body.type).toBe('EXPENSE');

    req.flush({
      baselineMetrics: { minBalance: -500, negativeDays: 10, finalBalance: -100 },
      simulatedMetrics: { minBalance: -800, negativeDays: 20, finalBalance: -400 },
      minBalanceDelta: -300,
      enteredNegativeAfterSimulation: false,
      goalsAfterSimulation: []
    });
  });
});
