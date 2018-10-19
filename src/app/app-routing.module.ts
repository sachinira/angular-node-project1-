import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";

const routes: Routes = [
    {path: '' , component: PostListComponent},
    {path: 'content' , component:PostCreateComponent},
    {path: 'edit/:postId' , component:PostCreateComponent} //we pass the post id along with the url
];

//this is an angular module so we have to decorate it with module
@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule] //here we export the router module where it can be used with the routes we defined outside this class
})
export class AppRoutingModule{}