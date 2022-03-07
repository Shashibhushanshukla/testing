import { IsEmail, isEmail, IsNotEmpty } from "class-validator";


export class UserContactDto
{
  
  @IsNotEmpty({message:"Name should not be empty"})
  name: string;

  @IsEmail({}, { message: 'Invalid email id' })
  email: string;

  @IsNotEmpty({message:"Phone should not be empty"})
  phone: string;

  @IsNotEmpty({message:"Address should not be empty"})
  address: string;

  
  @IsNotEmpty({message:"User email should not be empty"})
  userEmail: string;

  @IsNotEmpty({message:"Status should not be empty"})
  status: string;


}
