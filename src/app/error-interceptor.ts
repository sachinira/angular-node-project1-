import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ErrorComponent } from "./error/error.component";

//the first interceptor added a new header to every outgoing equest 
@Injectable()// we add injectable because we are going to inject a service inside this object
export class ErrorInterceptor implements HttpInterceptor{

    constructor(private dialog:MatDialog){}

    intercept(req:HttpRequest<any>,next:HttpHandler){
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse )=>{
                let errorMessage = "unknown error!";
                if(error.error.message){
                    errorMessage = error.error.message;
                }
                this.dialog.open(ErrorComponent,{data: {message: errorMessage}}); //we opn the dialog this is  on the docs of angular material
                //can pass data as a second argumnet 
                //as we are adding to the observable stram we are hanling in other places of app so we have to rtuen an observable
                return throwError(error);
                

            })//allowes us to handle error emmitted in this stream
        );//now we can also listen to the response here we don't want to change the request instead we want to listen to the response
        //handle gives us back response observable stream 
        //use pipe to add an operator to the stream
    }
}