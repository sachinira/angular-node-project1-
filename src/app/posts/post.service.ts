import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  baseUrl = 'http://localhost:3000'

  private posts:Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http:HttpClient) { }




  getPosts(){
    //return [...this.posts];
    //what happens here????? as we ar returning a copy of array here we don't get the updated content so we can use subscriptions
    this.http.get<{message:string,posts:any}>(this.baseUrl +'/api/posts')
    .pipe(map((data)=>{
      //we made that to any because the server will not return a valid Post and we're going to convert it
      return data.posts.map(post =>{
        return {
          title: post.title,
          content:post.content,
          id:post._id
        };

      });
    })) //we can convert the data we receive from the backend to be good for the frontend     //we can pipe multiple operators 
    .subscribe( //map allows to convert a whole array  into a new element and store them in a new object it has a function that execute on every data receive
      //problem is can,t we take this in the form of an object
      (transformedData)=>{
        this.posts = transformedData;
        //why we pass a copy of the data retured
        this.postsUpdated.next([...this.posts]);
      }
    )
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  createPosts(title:string,content:string){
    const post: Post = { id:null, title:title, content:content };

    this.http.post<{message:string,postId:string}>(this.baseUrl+'/api/posts',post).subscribe(
      (data)=>{

        const postId = data.postId;
        console.log(data.message);

        post.id = postId; //we just update the id in the object we didn't override it
        this.posts.push(post);
        //we update the subject 
        this.postsUpdated.next([...this.posts]);
        
      });
  }


  updatePost(id:string,title:string,content:string){

    //we create a post which has an id title and content
    const post:Post = {id:id, title:title, content:content};
    this.http.put(this.baseUrl+'/api/posts/' + id ,post)
    .subscribe(data=>{
      console.log(data);

      // we have to update the current version of the post with the old version of the post
      //we clone our posts array
       const updatedPosts = [...this.posts];
       //get the index of the post we have to update from this array
       const indexUpdated = updatedPosts.findIndex(p => p.id === id);
       updatedPosts[indexUpdated] = post;
       this.posts = updatedPosts;
       //we sre telling the app its updated by sending
       this.postsUpdated.next([...this.posts ]);
      
    });
  }

  deletePost(id:string){
    this.http.delete(this.baseUrl + '/api/posts/'+id)
    .subscribe((data)=>{
      //we have to update the frontend when the posts are deleted
      const updatedPosts = this.posts.filter(post => post.id !== id);
      //we filter the data which are not with the id to be deleted
      this.posts = updatedPosts;  
      this.postsUpdated.next([...this.posts]);//i don't know what happens here??

      // or the first time an post is entered it's id is null we didn't handle delete for null objects so error
      // so we have to get the post id when we post the posts from the backend to the frontend

    } );
  }


  //we have to fetch a single post from the list of posts so must create a  new method
  getPost(id:string){

    //when we call an http code here it will be an asynchronous call so we can't return inside of a subscription
    return this.http.get<{_id:string,title:string,content:string}>(this.baseUrl+'/api/posts/'+id);

    //return {...this.posts.find(p=> p.id ===id)};
    //we have to replace this to be return the posts fromthe database instead of fetching them locally from the other component because when we refresh the psts create component the current post array will be empty 
    //(...)this is called the sprat operator it is use to pull out all properties of an object and assign it to
    //a  new object so we don't manipulat the original object 
    //an object is returned because want to create a clone of the object ??? 
  }
}
