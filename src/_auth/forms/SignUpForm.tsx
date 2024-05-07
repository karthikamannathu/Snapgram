import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/Button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { SignUpValidation } from "@/lib/Validation"
import {Loader} from "@/components/ui/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"



export default function SignUpForm() {
const { toast } = useToast()
const navigate = useNavigate()
const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

    

// 1.define your from
const form = useForm<z.infer<typeof SignUpValidation>>({
        resolver: zodResolver(SignUpValidation),
        defaultValues: {
            name:'',
          username: '',
          password:'',
          email:'',

        },
      })


      // Queries
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSigningInUser } = useSignInAccount();

       // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignUpValidation>) {
  
   const newUser = await  createUserAccount(values);
   
  
  if(!newUser) {
    return toast({
      title: "Sign up failed. please, try again."
    })
  }

   const session = await signInAccount({
    email: values.email,
    password: values.password,

   })

   if(!session) {
    return toast({
      title: "Sign In failed. please, try again. "
    })
  }

  const isLoadingIn = await checkAuthUser();
  
  if(isLoadingIn){
    
    form.reset()
    navigate('/')
    
  } else {
    return  toast({
      title: "Sign In failed. please, try again. "
    })
  }
 
}


  return (
    <Form {...form}>
<div className="sm:w-420 flex-center flex-col ">
    <img src="assets\images\logo.svg"/>
    <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
    <p className=" text-ligh-3 small-medium md:base-regular mt-2 ">
      To use snapgram, please enter your account details</p>
    <form onSubmit={form.handleSubmit(onSubmit)} 
    className="flex flex-col gap-5 w-full mt-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input type="text" className="shad-input"
              {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input type="text" className="shad-input"
              {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" className="shad-input"
              {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" className="shad-input"
              {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" className="shad-button_primary">
              {isCreatingAccount || isSigningInUser || isUserLoading ? (
          <div className="flex-center gap-2">
            <Loader/> Loading...
          </div>
        ):"Sign up"}
        </Button>

        <p className=" text-samll-regular text-light-2 
        text-center mt-2">Already you have an account
        <Link to="/sign-in" className="text-primary-500 
        text-small-semibold ml-1" >Login</Link>
        </p>
    </form>
    </div>
  </Form>
  )
}
