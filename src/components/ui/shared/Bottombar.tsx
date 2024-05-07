import { bottombarLinks } from "@/Constant";
import { useLocation ,Link} from "react-router-dom"


export const Bottombar = () => {
  const {pathname} = useLocation();
  return (
    <section className="bottom-bar">
        {bottombarLinks.map((link) =>{
            const isActive = pathname === link.route;
            return(
              <Link 
              to={link.route} 
              key={link.label}
              className={`bottombar-link group
                ${isActive && 'bg-primary-500 rounded-[10px]'}
               flex flex-center flex-col gap-1 p-2 transition`}>
                <img
                src={link.imgURL}
                alt={link.label}
                width={16}
                height={16}
                className = {`group-hover:invert-white 
                ${ isActive && 'invert-whte'}`}/>
                 <p className="tiny-medium text-light-2">{link.label}</p>
              </Link>
              
            )
           })}
    </section>
  )
}
