import { z } from "zod"


export const SignUpValidation = z.object({
    name: z.string().min(2, { message: "Too Short" }),
    username: z.string().min(2, { message:'Too short' }),
    email:z.string().email(),
    password:z.string().min(8, { message:'Password must be less then 8 characters.' })
  })
  
  export const  SigninValidation = z.object({
    email:z.string().email(),
    password:z.string().min(8, { message:'Password must be less then 8 characters.' })
  })

  export const  PostValidation =  z.object({
    caption: z.string().min(5).max(2200),   
    file:z.custom<File[]>(),
    location:z.string().min(2).max(100),
    tags:z.string(),
  })