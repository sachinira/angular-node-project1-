import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable()//we have to have injectable to be able to inject the services
export class AuthGuard implements CanActivate {

    constructor(private aservice:AuthService,private router:Router){}

    canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot):boolean | Observable<boolean> | Promise<boolean>
    {
        const auth = this.aservice.getIsAuth();
        //if  we return true in this method then the route will know it is accessible
        //if we are returning false we have to provide an alternative to route 
        if(!auth){
            this.router.navigate(['/login']);
        }
        return true;
    }

}