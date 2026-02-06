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
});
