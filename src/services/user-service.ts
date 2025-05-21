import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserCredentials } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/signin';

  constructor(private http: HttpClient) {}

  signIn(credentials: IUserCredentials): Observable<any> {
    return this.http.post(this.apiUrl, credentials);
  }
}
