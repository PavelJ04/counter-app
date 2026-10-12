import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, timeout } from 'rxjs';
import { PublicHoliday } from '../models/public-holiday';

@Injectable({
  providedIn: 'root',
})
export class HolidayApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://openholidaysapi.org/PublicHolidays';

  async getHolidays(validFrom: string, validTo: string): Promise<PublicHoliday[]> {
    const holidays = await firstValueFrom(
      this.http
        .get<PublicHoliday[]>(this.apiUrl, {
          params: {
            countryIsoCode: 'CZ',
            languageIsoCode: 'CS',
            validFrom,
            validTo,
          },
        })
        .pipe(timeout(10000)),
    );

    return holidays.sort((a, b) => a.startDate.localeCompare(b.startDate));
  }
}
