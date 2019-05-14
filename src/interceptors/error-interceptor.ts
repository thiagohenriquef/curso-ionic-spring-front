import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable } from "rxjs";
import { StorageService } from "../services/storage.service";
import { AlertController } from "ionic-angular";
import { FieldMessage } from "../models/fieldmessage";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(public storage: StorageService, public alert: AlertController) {

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .catch((err, caught) => {
                let errorObj = err;
                if (errorObj.error) {
                    errorObj = errorObj.error;
                }
                if (!errorObj.status) {
                    errorObj = JSON.parse(errorObj);
                }

                console.log('Erro ao realizar a requisição: ', errorObj);

                switch(errorObj.status) {
                    case 401:
                        this.handle401();
                        break;
                    case 403:
                        this.handle403();
                        break;
                    case 422:
                        this.handle422(errorObj);
                        break;
                    default:
                        this.handleDefaultError(errorObj);
                }

                return Observable.throw(errorObj);
            }) as any;
    }

    handleDefaultError(errorObj) {
        const alert = this.alert.create({
            title: `Error ${errorObj.status}: ${errorObj.error}`,
            subTitle: errorObj.message,
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'OK'
                }
            ]
        });
        alert.present();
    }

    handle401() {
        const alert = this.alert.create({
            title: 'Erro 401: Falha de autenticação!',
            subTitle: 'Email ou senha incorretos',
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'OK'
                }
            ]
        });
        alert.present();
    }

    public handle403() {
        this.storage.setLocalUser(null);
    }

    public handle422(errorObj) {
        const alert = this.alert.create({
            title: 'Erro 422: Validação!',
            subTitle: this.listErrors(errorObj.errors),
            buttons: [
                {
                    text: 'OK'
                }
            ]
        });
        alert.present();
    }

    private listErrors(errors : FieldMessage[]) : string {
        return errors.reduce((acc, curr) => `${acc} <p><strong>${curr.fieldName}</strong>: ${curr.message}</p>`, '');
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
}