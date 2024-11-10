import { Injectable } from '@angular/core';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';
import { JwtPayload, jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  saveToken(token: string) {
    //localStorage.setItem('token', token);
    setCookie('token', token, {  expires: 365, path:'/' });
  }

  getToken() {
    //const token = localStorage.getItem('token');
    const token = getCookie('token');
    return token;
  }

  removeToken() {
    //localStorage.removeItem('token');
    removeCookie('token');
  }

  saveRefreshToken(token: string) {
    //localStorage.setItem('token', token);
    setCookie('Refreshtoken', token, {  expires: 365, path:'/' });
  }

  getRefreshToken() {
    //const token = localStorage.getItem('token');
    const token = getCookie('Refreshtoken');
    return token;
  }

  removeRefreshToken() {
    //localStorage.removeItem('token');
    removeCookie('Refreshtoken');
  }

  isValidRefreshToken() {
    const token = this.getRefreshToken();
    if(!token) {
      return false;
    }

    const decodeToken = jwtDecode<JwtPayload>(token);
    if(decodeToken && decodeToken?.exp){
      const tokenDate = new Date(0);
      tokenDate.setUTCSeconds(decodeToken.exp);
      const today = new Date();
      return tokenDate.getTime() > today.getTime();
    }
    return false;
  }

  isValidToken() {
    const token = this.getToken();
    if(!token) {
      return false;
    }

    const decodeToken = jwtDecode<JwtPayload>(token);
    if(decodeToken && decodeToken?.exp){
      const tokenDate = new Date(0);
      tokenDate.setUTCSeconds(decodeToken.exp);
      const today = new Date();
      return tokenDate.getTime() > today.getTime();
    }
    return false;
  }
}
