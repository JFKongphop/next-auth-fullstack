/* Login */

import React from 'react';
import Input from '../input/Input';
import SlideButton from '../button/SlideButton';

import { SubmitHandler, useForm } from 'react-hook-form';
import { FiMail, FiLock } from 'react-icons/fi';

import z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, UseFormRegister } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

const FormSchema = z.object({
  email: z.string().email('Please enter a valid email adress.'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters.')
    .max(52, 'Password must be less than 52 characters.'),
});

type FormSchemaType = z.infer<typeof FormSchema>;

interface ILogin {
  callbackUrl: string;
  csrfToken: string;
}

const Login: React.FC<ILogin> = ({ 
  callbackUrl,
  csrfToken
}) => {
  const router = useRouter();
  const path = router.pathname;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema)
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
    try {
      // it seem like signin with platform but we use credential
      // callbackUrl is where we redirect to (get from auth page)
      const res: any = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl
      });

      if (res.error) toast.error(res.error);
      else router.push('/')
    }
    catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="w-[550px] px-12 py-2">
      <h2 
        className="
          text-center text-2xl font-bold 
          tracking-wide text-gray-800
          w-full
        "
      >
        Sign In
      </h2>
      <p className="text-center text-sm text-gray-600 mt-2">
        You don't have an account ? &nbsp;
        <a
          className="
            text-blue-600 hover:text-blue-700 
            hover:underline cursor-pointer
          "
          // change the route to signup page
          onClick={() => {
            router.push({
              pathname: path,
              query: {
                tab: 'signup'
              }
            })
          }}
        >
          Sign Up
        </a>
      </p>
      <form
        method="post"
        action="/api/auth/signin/email"
        className="my-4 text-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col">
          {/* csrfToken from auth page that generate from nextauth */}
          <input 
            type="hidden" 
            name="csrfToken" 
            defaultValue={csrfToken}
          />
          <Input 
            name="email"
            label="Email"
            type="email"
            placeholder="example@gmail.com"
            errors={errors?.email?.message}
            icon={<FiMail />}
            register={register as unknown as UseFormRegister<FieldValues>} 
            defaultValue={''}          
          />
          <Input 
            name="password"
            label="Password"
            type="password"
            placeholder="********"
            errors={errors?.password?.message}
            icon={<FiLock />}
            register={register as unknown as UseFormRegister<FieldValues>} 
            defaultValue={''}          
          />
        </div>
        <div className="py-2 hover:underline min-w-fit">
          <Link 
            href="/forgot"
            className="text-blue-600"
          >
            Forgot Password ?
          </Link>
        </div>
        <SlideButton
          type="submit"
          text="Sign In"
          slideText="Secure sign up"
          icon={<FiLock/>}
          disabled={isSubmitting}
        />
      </form>
    </div>
  );
}

export default Login;
