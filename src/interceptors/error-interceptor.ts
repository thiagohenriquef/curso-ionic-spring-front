import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
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

                return Observable.throw(errorObj);
            }) as any;
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
}