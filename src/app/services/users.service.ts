import { Injectable } from '@angular/core';

import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '@services/token.service';
import { User } from '@models/user.model';
import { checkToken } from '@interceptors/token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  apiUrl = environment.API_URL;

  constructor(private http: HttpClient, private tokenSerive: TokenService) { }

  getUsers() {
    //const token = this.tokenSerive.getToken();
    return this.http.get<User[]>(`${this.apiUrl}/api/v1/users`, { context: checkToken()  });
  }

}
