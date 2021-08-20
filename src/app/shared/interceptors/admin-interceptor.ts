import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "@app/pages/auth/auth.service";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { LoadingService } from "../components/loading/services/loading.service";

@Injectable()
export class AdminInterceptor implements HttpInterceptor {

    constructor(private _loadSvc: LoadingService, private authSvc: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this._loadSvc.toggle(true);

        var user = this.authSvc.userValue;

        if(req.url.includes('usuario')){
            const authReq = req.clone({
                setHeaders: {
                    auth: String(user?.token)
                }
            });

            return next.handle(authReq).pipe(
                tap(
                    (event: HttpEvent<any>) => {
                        if(event instanceof HttpResponse){
                            this._loadSvc.toggle(false);
                        }
                    },
                    (error: any) => {
                        this._loadSvc.toggle(false);
                    }
                )
            )
        }

        return next.handle(req).pipe(
            tap(
                (event: HttpEvent<any>) => {
                    if(event instanceof HttpResponse){
                        this._loadSvc.toggle(false);
                    }
                },
                (error: any) => {
                    this._loadSvc.toggle(false);
                }
            )
        )
    }

}