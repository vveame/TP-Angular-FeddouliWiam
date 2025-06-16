import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ISignUpCredentials, IUserCredentials, User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  signIn(credentials: IUserCredentials): Observable<User> {
  return this.http.post<any>(`${this.apiUrl}/signin`, credentials).pipe(
    tap(rawUser => {
      const user = User.fromJSON(rawUser);
      this.currentUserSubject.next(user);
    })
  );
}

  signUp(credentials: ISignUpCredentials): Observable<any> {
     return this.http.post(`${this.apiUrl}/signup`, credentials, { responseType: 'text' });
  }

  signOut() {
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
