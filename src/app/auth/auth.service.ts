import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { environment } from "../../environments/environment";
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token:string;
  private isAuthenticated = false;
  private timer:any;
  private userId:string;//we are going to get the userid returned from the backend

  private authStateListener = new Subject<boolean>();//we use this to push authetication information for any interested component
 //we return true or false from this
  //we could add an authentication listener to see if a user is authenticated or not 


  constructor(private http: HttpClient,private router:Router) { }


  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getUserId(){
    return this.userId;  //we can now get this user id at any component
  }

  getAuthstateListener(){
    return  this.authStateListener.asObservable();
    //where we can't emit new values from other components and it can be done in service component only
  }

  createUser(email: string,password: string){

    const authData:AuthData = { email: email,password: password};
    return this.http.post(BACKEND_URL+ '/user/signup', authData)
    .subscribe(data =>{
      console.log(data);
      this.router.navigate(['/']);
      
      //we are going to log an error message when we have one
    },
    err =>{
      this.authStateListener.next(false);  // we inform the entire app that we are not authenticated
      
    });
   

  }

  loginUser(email: string,password: string){

    const authData:AuthData = {email: email,password: password};
    this.http.post<{message:string,token:string,expiresIn:number,userId:string}>(BACKEND_URL+ '/user/login',authData)
    .subscribe(data=>{
      const token = data.token;
      this.token = token;  
      if(token){

        const tokenDuration = data.expiresIn;
        this.setAuthTimer(tokenDuration);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + tokenDuration*1000);

        this.userId = data.userId;
        this.saveAuthData(token,expirationDate,this.userId);//we can use these values to initialize the auth status when the app starts
        this.isAuthenticated = true;
        this.authStateListener.next(true); //this is informing every component that the user have been authenticated
        this.router.navigate(['/']);
      }
    },
    err=>{
      this.authStateListener.next(false);
    });
  }

  logOutUser(){
    this.isAuthenticated = false;
    this.token = null;
    this.userId = null;//when logging out id must be set to null
    this.authStateListener.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.timer);
    this.clearAuthData();
  }

  autoAuthUser(){ //to automatically authenticate user if the localstorage is given
    const authInfo = this.getAuthData()//we store the data in a javascript object
    if(!authInfo){
      return;
    }
    //we check if the expiration date is still in the future
    const now  = new Date();

    
    const inFuture = authInfo.expirationDate.getTime() - now.getTime();

    //in th automatic authentication also we have to start the timer

    if(inFuture > 0){//if the token is still valid 
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.setAuthTimer(inFuture /1000); //as authtimer works in seconds
      this.authStateListener.next(true);
    }
  }

  private saveAuthData(token:string,expirationDate:Date,userId:string){
    //we use the date here because the time in seconds is a relative measure

    localStorage.setItem('token',token);
    localStorage.setItem('expiration',expirationDate.toISOString());
    localStorage.setItem('userId',userId);

  }

  private setAuthTimer(duration: number){

    this.timer =  setTimeout(()=>{
      //we are setting a timer for the tokenduration returned by the backend and set a timer to logout the user after that timeout
      this.logOutUser();

    }, duration * 1000);
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expiration = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");

    if(!token || !expiration) {
      return;// if one is not available do nothing
    }
    return {
      token:token,
      expirationDate: new Date(expiration),
      userId: userId
    }

    //esle a javascript object is returned
  }

  
  
}
