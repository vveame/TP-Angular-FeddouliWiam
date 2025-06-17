import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { ISignUpCredentials, IUserCredentials, User } from '../models/User';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  signIn(credentials: IUserCredentials): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, credentials, {
      responseType: 'text',
      withCredentials: true
    }).pipe(
      tap(() => this.getCurrentUser().subscribe())
    );
  }

  signUp(credentials: ISignUpCredentials): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, credentials, { responseType: 'text' });
  }

  signOut(): void {
    this.http.post(`${this.apiUrl}/signout`, {}, { withCredentials: true }).subscribe(() => {
      this.currentUserSubject.next(null);
    });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      // transforme le JSON reçu en instance User
      map(data => User.fromJSON(data)),
      tap(user => this.currentUserSubject.next(user))
    );
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${user.getUserId()}`, user.toJSON(), {
      withCredentials: true
    }).pipe(
      map(data => User.fromJSON(data)),
      tap(updatedUser => this.currentUserSubject.next(updatedUser))
    );
  }
}
