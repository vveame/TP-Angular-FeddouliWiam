import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map, switchMap } from 'rxjs';
import { ISignUpCredentials, IUserCredentials, NewUserForm, User } from '../models/User';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  signIn(credentials: IUserCredentials): Observable<User> {
    return this.http.post(`${this.apiUrl}/signin`, credentials, {
      responseType: 'text',
      withCredentials: true
    }).pipe(
      // Après connexion, on récupère les infos utilisateur via /me
      // switchMap permet d'enchaîner un second appel HTTP
      switchMap(() => this.getCurrentUser())
    );
  }

  signUp(credentials: ISignUpCredentials): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, credentials, { responseType: 'text' });
  }

  signOut(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/signout`, {}, {
      withCredentials: true,
      responseType: 'text' as 'json'
    }).pipe(
      tap(() => this.currentUserSubject.next(null))
    );
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
      map(data => User.fromJSON(data))
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, { withCredentials: true }).pipe(
      // transforme le JSON reçu en instance Order
      map(data => data.map((item: any) => User.fromJSON(item))));
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`, { withCredentials: true });
  }

  addUser(data: NewUserForm): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, data, { withCredentials: true });
  }
}
