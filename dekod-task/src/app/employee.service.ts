import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://api.test.ulaznice.hr/paganini/api/job-interview/employees';

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        if (response && response.data) {
          return response.data;
        } else {
          throw new Error('Unexpected response structure');
        }
      })
    );
  }
}
