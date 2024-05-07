import PostForm from "@/components/ui/Forms/PostForm"
import {Loader} from "@/components/ui/shared/Loader";
import {  useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { useParams } from "react-router-dom"


export const EditPost = () => {
  const { id } = useParams();
  const {data:post,isPending} = useGetPostById(id || '');

if(isPending) return <div className="common-container"><Loader/></div> 


  return (
    <div className='flex flex-1'>
    <div className='common-container'>
      <div 
      className='max-w-5xl flex-start 
      gap-3 justify-start w-full'>
        <img src='/assets/icons/add-post.svg' 
        width={36}
        height={36}
        alt='add'/>
        <h2 className='h3-bold md:h2-bold text-left w-full'>
         Edit Post
        </h2>
      </div>
      
      <PostForm action = "Update" post ={post}/>
    </div>
  </div>
  )
}
