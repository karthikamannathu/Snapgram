import { Models } from "appwrite";
import { Loader } from "./Loader";
import GridPostLists from "./GridPostLists";
import { serachPost } from "@/lib/appwrite/api";

type SearchResultsProps = {
    isSerachFeching : boolean;
    searchedPost :Models.Document[];
}

const SearchResults = ({isSerachFeching,searchedPost}:
    SearchResultsProps) => {
        if(isSerachFeching) return <Loader/>

        if(searchedPost && searchedPost.documents.length > 0){
     return (<GridPostLists posts = {searchedPost .documents} />
        )
    }
  return (
<p className="text-light-4 mt-10 text-center w-full">NO Results Found</p>
  )
}

export default SearchResults
