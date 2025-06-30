import React, { useState } from 'react'
import { LoaderPinwheel } from 'lucide-react';
import { Link } from 'react-router';
import img from '../imgs/signupimg.png';
import useSignup from '../hooks/useSignup.js';


const SignUpPage = () => {

  const [signupData, setsignUpData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  //Before custom hook:
  // const queryClient = useQueryClient();
  // const { mutate:signupMutation, isPending, error } = useMutation({
  //   mutationFn: signup,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // })

  const {isPending, error, signupMutation} = useSignup();

  const handleSignup = (e) =>{
    e.preventDefault();
    signupMutation(signupData)
  };

  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme="forest">

      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-4xl mx-auto bg-base-100 rounded-lg shadow-lg overflow-hidden'> 

        {/* SignUp Form Left */}
        <div className='w-full lg:w-1/2 p-4 flex flex-col'>
          {/* Logo */}
        <div className='mb-4 flex items-center justify-start gap-2'>
          <LoaderPinwheel className='size-9 text-primary'/>
          <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
            Nexora
          </span>
        </div>

        {/* Error Msg */}
      {
        error && (
          <div className='alert alert-error mb-4'>
            <span>{error.response.data.message}</span>
          </div>
        )
      }

        <div className='w-full'>
        <form onSubmit={handleSignup}>

          <div className='space-y-4'>
            <div>
              <h2 className='text-xl font-semibold'>Create an Account</h2>
              <p className='text-sm opacity-70'>
                Join Nexora and start your language learnig advanture!
              </p>
            </div>
            <div className='space-y-3'>
              {/* Fullname */}
              <div className='form-control w-full'>
                <label className='label'>
                  <span className='label-text'>
                    Full Name
                  </span>
                </label>
                <input type="text" placeholder='Enter Your Full Name' className='input input-bordered w-full' value={signupData.fullname} onChange={(e) => setsignUpData({ ...signupData, fullname: e.target.value })} required/>
              </div>
               {/* Email */}
              <div className='form-control w-full'>
                <label className='label'>
                  <span className='label-text'>
                    Email
                  </span>
                </label>
                <input type="email" placeholder='Enter Your Email' className='input input-bordered w-full' value={signupData.email} onChange={(e) => setsignUpData({ ...signupData, email: e.target.value })} required/>
              </div>
               {/* Password */}
              <div className='form-control w-full'>
                <label className='label'>
                  <span className='label-text'>
                    Password
                  </span>
                </label>
                <input type="password" placeholder='Enter Your Password' className='input input-bordered w-full' value={signupData.password} onChange={(e) => setsignUpData({ ...signupData, password: e.target.value })} required/>
                <p className='text-xs opacity-70 mt-1'>
                  Password must be at least 6 characters long 
                </p>
              </div>
              <div className='form-control'>
                <label className='label cursor-pointer justify-start gap-2'>
                  <input type="checkbox" className='checkbox checkbox-sm' required/>
                  <span className='text-xs leading-tight'>
                    I agree to the {" "}
                    <span className='text-primary hover:underline'>terms of service</span> and{" "}
                    <span className='text-primary hover:underline'>privacy policy</span>
                  </span>
                </label>
              </div>
            </div>
            <button className='btn btn-primary w-full' type='submit'>
                {isPending ? (
                  <>
                    <span className='loading loading-spinner loading-xs'>Loading...</span>
                  </>
                ) : ("Create Account")}
            </button>

            <div className='text-center mt-4'>
              <p className='text-sm'>
                Alrady have an account?{" "}
                <Link to="/login" className='text-primary hover:underline'>Sign in</Link>
              </p>
            </div>
          </div>
        </form>
        </div>
        </div>

        {/* SignUp Form Right */}
        <div className='hidden lg:flex flex-col bg-base-200 w-1/2 p-4 sm:p-8'>
        <div className='max-w-md p-8'>
          <div className='relative aspect-square max-w-sm mx-auto'>
            <img src={img} alt="" className='w-full h-full'/>
          </div>
          <div className='text-center space-y-3 mt-6'>
            <h2 className='text-xl font-semibold'>
              Connect with language partners worldwide
            </h2>
            <p className='opacity-70'>
              Practice conversations, make friends and improve your language skills together
            </p>
          </div>
        </div>
        </div>
      </div>
      
    </div>
  )
}

export default SignUpPage
