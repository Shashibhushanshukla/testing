import { IsEmail, isEmail, IsNotEmpty } from "class-validator";


export class UserContactV2Dto
{
  
  @IsNotEmpty({message:"First name should not be empty"})
  firstName: string;

  @IsNotEmpty({message:"Last name should not be empty"})
  lastName: string;

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
