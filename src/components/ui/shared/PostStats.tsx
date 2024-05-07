import { useDeleteSavePost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite"
import React, { useEffect, useState } from "react";
import {Loader} from ".";


type PostStartsProps = {
    post?:Models.Document;
    userId: string;
 }

export const PostStats = ({post, userId } : PostStartsProps) => {
  const likesLists = post?.likes.map((user:Models.Document) => user.$id)
   
  const [likes,setLikes ] = useState<string[]>(likesLists)
  const [isSave,setIsSave ] = useState(false)

const { mutate : likePost }  = useLikePost();
const { mutate : savePost ,isPending:isSavingPost}  = useSavePost();
const { mutate : deleteSavePost ,isPending:isDeletingSaved } = useDeleteSavePost();

const { data: currentUser }  = useGetCurrentUser();

const savePostRecord = currentUser?.save.
find((record:Models.Document) =>
 record.$id === post?.$id);

useEffect(() => {
setIsSave(!!savePostRecord)
},[currentUser])

const  handleLikePost = (e:React.MouseEvent) =>{
e.stopPropagation();

let newLikes = [...likes]

// const hasLiked = newLikes.includes(userId) 

if(newLikes.includes(userId)) {
  newLikes = newLikes.filter((Id) => Id !== userId);
  

}else {
  newLikes.push(userId) 
}

setLikes(newLikes);
likePost({postId:post?.$id || '',likesArray: newLikes})


}

const  handleSavePost = (e:React.MouseEvent) =>{
  e.stopPropagation();
  


if(savePostRecord){
 setIsSave(false);
 deleteSavePost(savePostRecord.$id)
}
else{
  savePost({postId:post?.$id || '',userId})
  setIsSave(true);
}
  
  }
  return (
    <div className=" flex justify-between items-center z-20">
        <div className="flex gap-2 mr-5">
            <img 
            src={checkIsLiked(likes,userId)
             ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"}
            
             alt="like" 
            width={20}
            height={20}
            onClick={ handleLikePost}
            className="cursor-pointer"/>
            <p className=" small-medium lg:base-medium">{likes.length}</p>
        </div>
        <div className="flex gap-2">
          { isSavingPost || isDeletingSaved ? <Loader/> : <img src={isSave 
            ? "/assets/icons/saved.svg"
            : "/assets/icons/save.svg"}
            
             alt="save" 
            width={20}
            height={20}
            onClick={handleSavePost}
            className="cursor-pointer hover:fill-red"/>}
            
        </div>
    </div>
  )
}
