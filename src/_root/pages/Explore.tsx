import { Input } from "@/components/ui/Input"
import { Loader } from "@/components/ui/shared";
import GridPostLists from "@/components/ui/shared/GridPostLists";
import SearchResults from "@/components/ui/shared/SearchResults";
import useDebounce from "@/hooks/useDebounce";
import { useGetPosts, useSerachPosts } from "@/lib/react-query/queriesAndMutations";
import { useEffect, useState } from "react"
import { useInView } from  'react-intersection-observer'



export const Explore = () => {
  const { ref,inView } = useInView();
  const { data: posts, fetchNextPage, hasNextPage,  } = useGetPosts();

  const [serachValue,setSerachValue] = useState("");
  const debounceValue = useDebounce(serachValue,500);
  const { data:searchedPost, isFetching: isSerachFeching } =
  useSerachPosts(debounceValue)

  useEffect(() => {
   if(inView  && !serachValue)  fetchNextPage();
  }, [inView,serachValue])

if(!posts) {
  return(

    <Loader/>
    
  )
}

const shouldSearchResults = serachValue !== '';
const shouldShowPosts = !shouldSearchResults && posts.pages.every
((item:any) => item.documents.length === 0)


  return (
    <div className='explore-container'>
      <div className="explore-inner_container">
      <h2 className="h3-bold md:h2-bold w-full"> search Posts</h2>
      <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
       <img src="/assets/icons/search.svg" alt="serach" 
       width={24}
       height={24}/>
       <Input
       type ="text"
       placeholder="Search"
       className="explore-search"
       value={serachValue}
       onChange={(e) => setSerachValue(e.target.value)}/>
      </div>
      </div>

      <div className="flex-between w-full 
      max-w-5xl mt-16 mb-7">
        <h2 className="body-bold md:h3-bold ">
         Popular Topday
        </h2>
        <div className="flex-center gap-3 bg-dark-3 
        rounded-xl px-4 py-2 cursor-pointer">
       
        <p className="small-medium md:base-medium text-light-2">
          All</p>
          <img src="/assets/icons/filter.svg" 
          alt="fitter" 
          width={20}
          height={20}/>
      </div>
      </div>
      <div className="flex flex-wrap gap-9 h-full w-full max-w-5xl ">
        {shouldSearchResults  ? (
          <SearchResults
          isSerachFeching ={isSerachFeching} 
          searchedPost  = {searchedPost}
           />
        
          ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center  w-full">
            Posts
          </p>
        ) : posts.pages.map((item:any,index) => (
          <GridPostLists key={`page-${index}`}
          posts = {item.documents}/>
        ))}
      </div>
      {hasNextPage && !serachValue && (
        <div ref={ref} className="mt-10">
          <Loader/>
        </div>
      )}
    </div>
  )
}
