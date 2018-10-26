import { Component, OnInit,Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy{

  //@Input() posts:Post[] = [];
  posts:Post[] = [];
  isLoading = false;

  private postSub:Subscription;

  userId:string;
  totalPosts:number = 0;
  pageSize:number = 2;
  currentPage = 1;
  pageSizeOptions:number[] = [2,5,10,20];


  public userIsAuthenticated = false;
  private authListenerSub:Subscription;

  constructor(private pservice:PostService, private aservice:AuthService) { }

  ngOnInit() {

    this.isLoading = true;
    this.pservice.getPosts(this.pageSize,this.currentPage);
    this.userId = this.aservice.getUserId();
    //this.userId = localStorage.getItem('userId');

    this.postSub =  this.pservice.getPostUpdateListener().subscribe
    ((postData: { post:Post[],maxPosts:number })=>{
        
        this.isLoading = false;
        this.posts = postData.post;
        this.totalPosts = postData.maxPosts;
      });
      this.userIsAuthenticated = this.aservice.getIsAuth();

    this.authListenerSub = this.aservice.getAuthstateListener()
    .subscribe(isAuthenticted=>{
      this.userIsAuthenticated = isAuthenticted;
      this.userId = localStorage.getItem('userId'); //here the user data is  taken if user is authenticated i changed this to ge it directly from the localstorage
    });
  }


  deletePost(id:string){
    
    this.isLoading = true;//we want to show the spinner when te deletion started
    this.pservice.deletePost(id).subscribe(data=>{
      this.pservice.getPosts(this.pageSize,this.currentPage)
    },
    ()=>{
      this.isLoading = false;
    });
  }

  onChangePage(pageData:PageEvent){

    this.isLoading = true;
    this.currentPage = pageData.pageIndex+1;
    this.pageSize = pageData.pageSize;
    this.pservice.getPosts(this.pageSize,this.currentPage);
    
    
  }

  ngOnDestroy(){

    this.postSub.unsubscribe();
    this.authListenerSub.unsubscribe();
    //remove subscription and remove memory leaks
  }

  //can input only from the parent component
  /*posts = [
    { title:'mypost 1',content:'This is the first post'},
    { title:'mypost 2',content:'This is the second post'},
    { title:'mypost 3',content:'This is the third post'},

  ]*/

}
