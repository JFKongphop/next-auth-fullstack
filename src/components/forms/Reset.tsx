/* Send new password to reset password */

import React, { useEffect, useState } from 'react';
import Input from '../input/Input';
import SlideButton from '../button/SlideButton';

import { SubmitHandler, useForm } from 'react-hook-form';
import { FiLock } from 'react-icons/fi';

import zxcvbn from 'zxcvbn'
import z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, UseFormRegister } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import Link from 'next/link';

const FormSchema = z.object({
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters.')
    .max(52, 'Password must be less than 52 characters.'),
  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword, {
    message: 'Password is not match.',
    path: ['confirmPassword'],
  }
);

type FormSchemaType = z.infer<typeof FormSchema>;

interface IReset {
  token: string;
}

const Reset: React.FC<IReset> = ({ token }) => {
  const [passwordScore, setPasswordScore] = useState<number>(0);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema)
  });

  const validatePasswordStrength = () => {
    const password = watch('password');

    return zxcvbn(password ? password : '').score;
  };

  const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
    console.log(values);

    // send the token with new password to sign to initial account
    try {
      const { data } = await axios.post('/api/auth/reset', {
        password: values.password,
        token
      });
      reset();
      toast.success(data.message);
    }
    catch (error: any) {
      toast.error(error.response.data.message)
    }
  };

  useEffect(() => {
    setPasswordScore(validatePasswordStrength);
  }, [watch('password')]);


  return (
    <div className="w-[550px] px-12 py-2">
      <h2 
        className="
          text-center text-2xl font-bold 
          tracking-wide text-gray-800
          w-full
        "
      >
        Reset password
      </h2>
      <p className="text-center text-sm text-gray-600 mt-2">
        Sign in instaed ? &nbsp;
        <Link
          className="
            text-blue-600 hover:text-blue-700 
            hover:underline cursor-pointer
          "
          href="/auth"
        >
          Sign In
        </Link>
      </p>
      <form 
        className="my-2 text-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col">
          <Input 
            name="password"
            label="Password"
            type="password"
            placeholder="********"
            errors={errors?.password?.message}
            disabled={isSubmitting}
            icon={<FiLock/>}
            register={register as unknown as UseFormRegister<FieldValues>}
          />
          {watch('password')?.length > 0 && (
            <div className="flex mt-2">
              {Array.from(Array(5).keys()).map((span, i) => (
                <span className="w-1/5 px-1" key={i}>
                  <div
                    className={`h-2 rounded-xl b ${
                      passwordScore <= 2
                        ? "bg-red-400"
                        : passwordScore < 4
                        ? "bg-yellow-400"
                        : "bg-green-500"
                    }`}
                  ></div>
                </span>
              ))}
            </div>
          )}
          <Input 
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="********"
            errors={errors?.confirmPassword?.message}
            disabled={isSubmitting}
            icon={<FiLock/>}
            register={register as unknown as UseFormRegister<FieldValues>}
          />
        </div>
        <SlideButton
          type="submit"
          text="Change password"
          slideText="Secure"
          icon={<FiLock/>}
          disabled={isSubmitting}
        />
      </form>
    </div>
  )
}

export default Reset;