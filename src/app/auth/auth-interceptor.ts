import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";


//this is an interceptor class like a middleware it runs on outgoing requests  so ite takes a req as an argument and 
//we are going to use this request on any kind of request so we put it as any
//we just intecept in sendig request so res is not handled and to allow the rest of the request to carry on there is a next method
//to inject services to other services we have to create injectable but it will be provided differently

@Injectable()
export class AuthInterceptor implements HttpInterceptor{


    constructor(private service:AuthService){}

    intercept(req:HttpRequest<any>,next:HttpHandler){
        //we have to do something inside this interceptor

        const authToken = this.service.getToken();
        
        //then we have to manipulate request to hold this token clone this request before we manipulate it so that to reduce unwanted side effects
        const authRequest = req.clone({
            headers: req.headers.set('Authorization', "Bearer " + authToken)
        });//we can pass configuration to clone method where we can edit the cloned request
        return next.handle(authRequest);
    }
}
