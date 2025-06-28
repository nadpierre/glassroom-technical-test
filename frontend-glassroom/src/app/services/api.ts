import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private BASE_URL = 'http://localhost:8000'
  private stats$!: Observable<any[]>;

  constructor(private http:HttpClient) {}

  getStats(): Observable<any[]> {
    if (!this.stats$) {
      this.stats$ = this.http.get<any[]>(`${this.BASE_URL}/stats`).pipe(
        shareReplay(1)
      );
    }
    return this.stats$;
  }
}
