import { useUserContext } from "@/context/AuthContext"
import { Models } from "appwrite"
import { Link } from "react-router-dom"
import { PostStats } from "./PostStats"

type GridPostListProps = {
    posts:Models.Document[];
    showUser?:boolean;
    showStarts?:boolean;    
}

const GridPostLists = ({ posts,showUser = true, showStarts = true }: GridPostListProps) => {
    const { user } = useUserContext()
    console.log(posts,"posts")
  return (
    <ul className="grid-container  bg-black">
     {posts.map((post) => (      
        <li key={post.$id} className=" min-w-50 h-64 ">
            {post.caption}
            <Link to={`/post/${post.$id}`}  className=" grid-post_link relative m-2">
                <img
                 src={post?.imageUrl                 } 
                 alt="" 
                 className="h-full
                 w-full object-fix "/>
          
         
            <div className="grid-post_user ">
                {showUser && (
                    <div className="flex items-center justify-start gap-2
                    flex-1">
                        <img src={post.creator?.imageUrl
                         } alt="creator"
                        className="h-8 w-0 rounded-full" />
                        <p>{post?.creator?.name}</p>
                    </div>
                     
                )}
                 {showStarts && <PostStats post={post} userId={user?.id}/>}
                 </div>
                
               </Link>
                
     </li>
               
     ))}
    </ul>
  )
}

export default GridPostLists
