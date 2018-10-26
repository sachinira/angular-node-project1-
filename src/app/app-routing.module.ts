import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { AuthGuard } from "./auth/AuthGuard";

const routes: Routes = [
    { path: '' , component: PostListComponent},
    { path: 'content' , component:PostCreateComponent, canActivate: [AuthGuard]},
    { path: 'edit/:postId' , component:PostCreateComponent, canActivate: [AuthGuard]}, //we pass the post id along with the url
    // we want to load these routes lazyly as when we need them only]
    { path: "auth",loadChildren: "./auth/auth.module#Authmodule"}
];

//this is an angular module so we have to decorate it with module
@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule], //here we export the router module where it can be used with the routes we defined outside this class
    providers: [AuthGuard]
})
export class AppRoutingModule{}