import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl;//we create an angular environment file to create an environment variable


@Injectable({
  providedIn: 'root'
})
export class PostService {


  private posts:Post[] = [];
  private postsUpdated = new Subject<{post:Post[],maxPosts:number}>();

  constructor(private http:HttpClient,private router:Router) { }




  getPosts(postsPerPage:number,page:number){
    //return [...this.posts];
    //what happens here????? as we ar returning a copy of array here we don't get the updated content so we can use subscriptions

    const queryParams = `?pagesize=${postsPerPage}&page=${page}`; //backtics allow to add dynamic parts to strings

    this.http.get<{message:string,posts:any,count:number}>(BACKEND_URL +'/posts'+ queryParams)
    .pipe(map((data)=>{

      console.log(data);
      
      //we made that to any because the server will not return a valid Post and we're going to convert it
      return {
        posts: data.posts.map(post =>{
          
        return {
          title: post.title,  //HERE A JAVASCRIPT OBJECT IS RETURNED
          content:post.content,
          id:post._id, //when we get the posts to the frontned we have to use the imagepath too
          imagePath: post.imagePath,
          creator:post.creator //in the post information we are gettin from the server we are storing creator info
        };
        }),
        maxPosts: data.count
      };
    })) //we can convert the data we receive from the backend to be good for the frontend     //we can pipe multiple operators 
    .subscribe( //map allows to convert a whole array  into a new element and store them in a new object it has a function that execute on every data receive
      //problem is can,t we take this in the from of an object
      (transformedData)=>{
        this.posts = transformedData.posts;
        //why we pass a copy of the data retured
        this.postsUpdated.next({post: [...this.posts],maxPosts: transformedData.maxPosts});// we get the list of post array and mximum no of posts to the frontend
      }
    )
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  createPosts(title:string,content:string,image:File){
    //const post: Post = { id:null, title:title, content:content };

    //when creatiing posts now we have to send the file also so using post cannot be done
    const postData  = new FormData();//formdata allows to send text values and also bolbs
    postData.append('title',title);
    postData.append('content',content); 
    postData.append('image',image,title); //we are going to access this property in the single method in backend so the names should be same
    //this title will be used to create the filename in the backend

    this.http.post<{message:string,post: Post}>(BACKEND_URL +'/posts',postData).subscribe(
      (data)=>{

        /*const post:Post = {
          id:data.post.id,
          title:title,
          content:content,
          imagePath: data.post.imagePath
        }

        //const postId = data.postId;
        console.log(data.message);
        //post.id = postId; //we just update the id in the object we didn't override it
        this.posts.push(post);
        //we update the subject 
        this.postsUpdated.next([...this.posts]);*/
        this.router.navigate(["/"]); 
      });
  }


  updatePost(id:string,title:string,content:string, image: File | string){

    //we create a post which has an id title and content
    //const post:Post = {id:id, title:title, content:content, imagePath: null};
    let postData;

    if(typeof(image) === "object"){

      postData = new FormData();
      postData.append("id",id);
      postData.append("title",title);
      postData.append("content",content);
      postData.append("image",image,title);

    }else{
        postData  = {
          id: id,
          title: title,
          content: content,
          imagePath : image,
          creator: null //we have to keep this creator id when we update the post
        }
    }

    
    //when we are updating images we have to differ if we have a string image or file //if we have an image we have to send a json request if we got an object/image we have to send as formdata
    this.http.put(BACKEND_URL+'/posts/' + id ,postData)
    .subscribe(data=>{
      console.log(data);

     /* // we have to update the current version of the post with the old version of the post
      //we clone our posts array
       const updatedPosts = [...this.posts];
       //get the index of the post we have to update from this array
       const indexUpdated = updatedPosts.findIndex(p => p.id === id);


       const post:Post ={
        id: id,
        title: title,           //this part and get posts part is not needed because the page is updated anyways
        content: content,
        imagePath : ""
       }

       updatedPosts[indexUpdated] = post;
       this.posts = updatedPosts;
       //we sre telling the app its updated by sending
       this.postsUpdated.next([...this.posts ]);*/
       this.router.navigate(["/"]);
      
    });
  }

  deletePost(id:string){
    return this.http.delete(BACKEND_URL + '/posts/'+id);
   /* .subscribe((data)=>{
      //we have to update the frontend when the posts are deleted
      const updatedPosts = this.posts.filter(post => post.id !== id);
      //we filter the data which are not with the id to be deleted
      this.posts = updatedPosts;  
      this.postsUpdated.next([...this.posts]);//i don't know what happens here??

      // or the first time an post is entered it's id is null we didn't handle delete for null objects so error
      // so we have to get the post id when we post the posts from the backend to the frontend

    });*/
  }


  //we have to fetch a single post from the list of posts so must create a  new method
  getPost(id:string){

    //when we call an http code here it will be an asynchronous call so we can't return inside of a subscription
    return this.http.get<{_id:string,title:string,content:string,imagePath:string,creator:string}>(BACKEND_URL+'/posts/'+id);

    //here in get posts we are not getting the imagpath to the front end in oninit

    //return {...this.posts.find(p=> p.id ===id)};
    //we have to replace this to be return the posts fromthe database instead of fetching them locally from the other component because when we refresh the psts create component the current post array will be empty 
    //(...)this is called the sprat operator it is use to pull out all properties of an object and assign it to
    //a  new object so we don't manipulat the original object 
    //an object is returned because want to create a clone of the object ??? 
  }
}
