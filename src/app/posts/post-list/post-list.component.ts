import { Component, OnInit,Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

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

  totalPosts:number = 0;
  pageSize:number = 2;
  currentPage = 1;
  pageSizeOptions:number[] = [2,5,10,20];


  constructor(public service:PostService) { }

  ngOnInit() {

    this.isLoading = true;
    this.service.getPosts(this.pageSize,this.currentPage);

    this.postSub =  this.service.getPostUpdateListener().subscribe
    ((postData: { post:Post[],maxPosts:number} )=>{
        
        this.isLoading = false;
        this.posts = postData.post;
        this.totalPosts = postData.maxPosts;
      });
  }


  deletePost(id:string){
    
    this.isLoading = true;//we want to show the spinner when te deletion started
    this.service.deletePost(id).subscribe(data=>{
      this.service.getPosts(this.pageSize,this.currentPage)
    });
  }

  onChangePage(pageData:PageEvent){

    this.isLoading = true;
    this.currentPage = pageData.pageIndex+1;
    this.pageSize = pageData.pageSize;
    this.service.getPosts(this.pageSize,this.currentPage);
    
    
  }

  ngOnDestroy(){

    this.postSub.unsubscribe();
    //remove subscription and remove memory leaks
  }

  //can input only from the parent component
  /*posts = [
    { title:'mypost 1',content:'This is the first post'},
    { title:'mypost 2',content:'This is the second post'},
    { title:'mypost 3',content:'This is the third post'},

  ]*/

}
