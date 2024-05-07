import { PostCard } from "@/components/ui/shared/PostCard";
import UsersCard from "@/components/ui/shared/UsersCard";
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import { Loader } from "lucide-react";


export const Home = () => {
  const { data: posts,isPending: isPostLoading,isError:
    isErrorPosts } = useGetRecentPosts()

    const {
      data: creators,
      isLoading: isUserLoading,
      isError: isErrorCreators,
    } = useGetUsers(10);
  
      if (isErrorPosts || isErrorCreators) {
        return (
          <div className="flex flex-1">
            <div className="home-container">
              <p className="body-medium text-light-1 pt-36  
              justify-self-center text-center">Something Error!!!</p>
            </div>
          </div>
        );
      }
    

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 
          className="h3-bold md:h2-bold text-left w-full">
            Home Feed</h2>
            { isUserLoading && !creators ? (
               <div className="  flex justify-center pt-32 h-72 w-full  ">
              <Loader />
              </div>
            ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              { posts?.documents.map((post:Models.Document) => (
              <li key={post.$id} className="flex  justify-center w-full">
              <PostCard post = {post}  key={post.caption}/>
              </li>
              ))}
               </ul>
          ) }
        </div>      
      </div>
   
    <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {isUserLoading && !creators ? (
         <div className='flex w-full justify-center bg-slate-400'>
         <Loader/></div>
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id}>
                <UsersCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}


