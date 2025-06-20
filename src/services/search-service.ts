// src/app/services/search-service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private querySubject = new BehaviorSubject<string>('');
  query$ = this.querySubject.asObservable();

  updateQuery(query: string) {
    this.querySubject.next(query);
  }
}