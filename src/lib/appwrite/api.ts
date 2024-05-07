import { INewPost, INewUser, IUpdatePost } from "@/types";

  import {account, appwriteConfig , avatars,databases ,ID, storage} from "./config";
import { Query } from "appwrite";






export async function createUserAccount(user:INewUser)
{
    try {
       const newAccount = await account.create(
        ID.unique(),
        user.email,
        user.password,
        user.name,
    ) ;
       if(!newAccount) throw Error
       const avatarUrl= avatars.getInitials(user.name);
      
       const newUser = await saveUserToDB({
      accountid: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    })
   
       return newUser;
    } catch (error) {
        console.log(error)
    }
}

// desturacter all users arrg
export async function saveUserToDB(user:{
    accountid:string;
    name:string;
    email:string;
    username?:string;
    imageUrl:URL;
}) 

{
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
          );
  
        return newUser;
      } catch (error) {
        console.log(error);
      }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);

    return session;
  } catch (error) {
    console.log(error);
  }
}


export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
       
        const currentUser = await databases.listDocuments(

            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountid',currentAccount.$id
            )]
            )

            if(!currentUser) throw Error;
            return currentUser.documents[0];
    } catch (error) {
        // console.log(error)
    }
}


export async function signOutAccount() {
 try {
const session = await account.deleteSession("current");
return session;
 } catch (error) {
    console.log(error)
 }   
}


export async function createPost(post: INewPost){
  try{
    
    const uploadedFile =  await uploadFile(post.file[0]);
    if(!uploadedFile) throw Error
  let fileUrl = getFilePreview(uploadedFile.$id)
 

  if (!fileUrl) {
    await deleteFile(uploadedFile.$id);
    throw Error;
  }
   
//convert tags in array
  const tags = post.tags?.replace(/ /g,'').split(',') || []

//save post to database

const newPost = await databases.createDocument(
  appwriteConfig.databaseId,
  appwriteConfig.postCollectionId,
  ID.unique(),
 
  {
    creator: post.userId,
    caption:post.caption,
    imageUrl: fileUrl,
    imageid :uploadedFile.$id,
    location: post.location,
    tags:tags
  }

)

if(!newPost){
  await deleteFile(uploadedFile.$id)
  throw Error
}
return newPost
  }
   catch (error){
 console.log(error)
  }
  
}


export async function uploadFile(file:File){
try {
  const uploadedFile = storage.createFile(
   appwriteConfig.storageId,
   ID.unique(),
   file
  );
  return uploadedFile
} catch (error) {
  console.log(error)
}
}


export  function getFilePreview(fileId: string) {
  try {
   const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}


export async function deleteFile(fileId:string) {
  
  try {
    
    await storage.deleteFile(appwriteConfig.storageId,fileId)
    return {status: 'ok'}
  } catch (error) {
   console.log(error) 
  }
}


export async function getRecentPosts() {
  const  posts = await databases.listDocuments(
   appwriteConfig.databaseId,
   appwriteConfig.postCollectionId,
   [Query.orderDesc('$createdAt'),Query.limit(20)] 
  )
  
  if(!posts) throw Error
  return posts

}


export async function likedPost(postId:string ,likesArray: string[]) {
  try {
    const updatePost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray
      }
    )
    if(!updatePost) throw Error;
    return updatePost
  } catch (error) {
    
  }
}


export async function savePost(postId:string ,userId: string) {
  try {
    const updatePost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId
      }
    )
    if(!updatePost) throw Error;
    return updatePost
  } catch (error) {
    
  }
}


export async function deleteSavePost(saveRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionId,
     saveRecordId,
      
    )
    if(!statusCode) throw Error;
    return { status :'ok'}
  } catch (error) {
    console.log(error)
  }
}


export async function getPostById(postId:string) {
  try {
    const post= await  databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )
    return post;
  } catch (error) {
  console.log(error)  
  }
}



export async function getUsers(limit?: number) {

  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries

    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }

}


export async function updatePost(post: IUpdatePost){
  const hasFileToUpdate = post.file.length > 0;
 
  try{
let  image = {
  imageUrl:post.imageUrl,
  imageId:post.imageId,
  
};

if(hasFileToUpdate) {
  const uploadedFile =  await uploadFile(post.file[0]);
  if(!uploadedFile) throw Error

  let fileUrl = getFilePreview(uploadedFile.$id)


  if (!fileUrl) {
    await deleteFile(uploadedFile.$id);
    throw Error;
  }
   

image = {...image, imageUrl:fileUrl,imageId:uploadedFile.$id}

}
  
//convert tags in array
  const tags = post.tags?.replace(/ /g,'').split(',') || []

//save post to database

const updatePost = await databases.updateDocument(
  appwriteConfig.databaseId,
  appwriteConfig.postCollectionId,
 post.postId,
 
  {
    caption:post.caption,
    imageUrl: image.imageUrl,
    imageid :image.imageId,
    location: post.location,
    tags:tags
  }

)

if(!updatePost){
  await deleteFile(image.imageId)
  throw Error
}
return updatePost 
  }
   catch (error){
 console.log(error)
  }
  
}


export async function deletePost(postId:string, imageId:string) {
  
if(!postId  || !imageId) throw Error;

try {
 
  await databases.deleteDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    postId
  )
  

} catch (error) {
  console.log(error)
}

}

export async function getInfinitePost({ pageParam }:{pageParam : number}) {
 const query:any [] = [ Query.orderDesc('$updatedAt') ,Query.limit(10)]
if(pageParam) {
  query.push(Query.cursorAfter(pageParam.toString()))
}

try {
const posts= await databases.listDocuments(
  appwriteConfig.databaseId,
  appwriteConfig.postCollectionId,
  query
) 
if(!posts) throw  Error;
return posts;
  } catch (error) {
    console.log(error)
  }
}

export async function serachPost(searchTerm : string) {
 
 
 try {
 const posts= await databases.listDocuments(
   appwriteConfig.databaseId,
   appwriteConfig.postCollectionId,
  [Query.search('caption', searchTerm) ]
 ) 
 if(!posts) throw  Error;

 return posts;

   } catch (error) {
     console.log(error)
   }
 }