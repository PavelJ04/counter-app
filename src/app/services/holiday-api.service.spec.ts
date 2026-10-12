import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { HolidayApiService } from './holiday-api.service';

describe('HolidayApiService', () => {
  let service: HolidayApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(HolidayApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});