import { Injectable } from "@angular/core";
import { CredencialDTO } from "../models/credenciais.dto";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";
import { StorageService } from "./storage.service";
import { LocalUser } from "../models/local_user";
import { JwtHelper } from 'angular2-jwt';

@Injectable()
export class AuthService {
    jwtHelper: JwtHelper = new JwtHelper();

    constructor(public http: HttpClient, public storage: StorageService) {

    }

    authenticate(creds: CredencialDTO) {
        return this.http.post(`${API_CONFIG.baseUrl}/login`, creds, {
            observe: 'response',
            responseType: 'text'
        });
    }

    successfullLogin(authorizationValue : string) {
        const token = authorizationValue.substring(7);
        const user : LocalUser = {
            token: token,
            email: this.jwtHelper.decodeToken(token)
        };
        this.storage.setLocalUser(user);
    }

    logout() {
        this.storage.setLocalUser(null);
    }
}