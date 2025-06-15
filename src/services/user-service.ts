import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISignUpCredentials, IUserCredentials } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  signIn(credentials: IUserCredentials): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, credentials);
  }

  signUp(credentials: ISignUpCredentials): Observable<any> {
     return this.http.post(`${this.apiUrl}/signup`, credentials, { responseType: 'text' });
  }
}
