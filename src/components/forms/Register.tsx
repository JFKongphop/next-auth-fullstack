/* Register */

import React, { useEffect, useState } from 'react';
import Input from '../input/Input';
import SlideButton from '../button/SlideButton';

import { SubmitHandler, useForm } from 'react-hook-form';
import { CiUser } from 'react-icons/ci';
import { FiMail, FiLock } from 'react-icons/fi';
import { BsTelephone } from 'react-icons/bs';

import validator from 'validator';
import zxcvbn from 'zxcvbn'
import z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, UseFormRegister } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import Link from 'next/link';

const FormSchema = z.object({
  firstname: z
    .string()
    .min(2, 'Firstname must be at least 2 characters.')
    .max(32, 'Lastname must be less than 32 characters.')
    .regex(new RegExp("^[a-zA-z]+$"), 'No special characters allowed.'),
  lastname: z
    .string()
    .min(2, 'Lastname must be at least 2 characters.')
    .max(32, 'Lastname must be less than 32 characters.')
    .regex(new RegExp("^[a-zA-z]+$"), 'No special characters allowed.'),
  email: z.string().email('Please enter a valid email adress.'),
  phone: z.string().refine(validator.isMobilePhone, {
    message: 'Please enter a valid phone number.'
  }),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters.')
    .max(52, 'Password must be less than 52 characters.'),
  confirmPassword: z.string(),
  accept: z.literal(true, {
    errorMap: () => ({
      message: 'Please agree to all terms and conditions before continuing.'
    })
  })
}).refine(
  (data) => data.password === data.confirmPassword, {
    message: 'Password is not match.',
    path: ['confirmPassword'],
  }
);

type FormSchemaType = z.infer<typeof FormSchema>;

const Register = () => {
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

    try {
      const { data } = await axios.post('/api/auth/signup', {
        ...values
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
    <div className="w-full px-12 py-2">
      <h2 
        className="
          text-center text-2xl font-bold 
          tracking-wide text-gray-800
          w-full
        "
      >
        Sign Up
      </h2>
      <p className="text-center text-sm text-gray-600 mt-2">
        You already have an account ? &nbsp;
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
        <div className="gap-2 md:flex">
          <Input 
            name="firstname"
            label="Firstname"
            type="text"
            placeholder="example"
            errors={errors?.firstname?.message}
            disabled={isSubmitting}
            icon={<CiUser/>}
            register={register as unknown as UseFormRegister<FieldValues>}
          />
          <Input 
            name="lastname"
            label="Lastname"
            type="text"
            placeholder="example"
            errors={errors?.lastname?.message}
            disabled={isSubmitting}
            icon={<CiUser/>}
            register={register as unknown as UseFormRegister<FieldValues>}
          />
        </div>
        <div className="flex flex-col">
          <Input 
            name="email"
            label="Email"
            type="email"
            placeholder="example@gmail.com"
            errors={errors?.email?.message}
            disabled={isSubmitting}
            icon={<FiMail/>}
            register={register as unknown as UseFormRegister<FieldValues>}
          />
          <Input 
            name="phone"
            label="Phone number"
            type="text"
            placeholder="123-456-7890"
            errors={errors?.phone?.message}
            disabled={isSubmitting}
            icon={<BsTelephone/>}
            register={register as unknown as UseFormRegister<FieldValues>}
          />
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
        <div className="flex item-center mt-3">
          <input 
            type="checkbox"
            id="accept"
            className="mr-2 focus:ring-0 rounded  w-4 h-4"
            {...register("accept")}
          />
          <label 
            htmlFor="accept" 
            className="text-gray-700"
          >
            I accept the&nbsp;
            <a 
              href="" 
              className="text-blue-600 hover:underline" 
              target="_blank"
            >
              terms
            </a>
            &nbsp;and&nbsp;
            <a 
              href="" 
              className="text-blue-600 hover:underline" 
              target="_blank"
            >
              privacy policy
            </a>
          </label>
        </div>
        <div className="">
          {
            errors?.accept && (
              <p className="text-sm text-red-600 mt-1">
                {errors?.accept.message}
              </p>
            )
          }
        </div>
        <SlideButton
          type="submit"
          text="Sign Up"
          slideText="Secure sign up"
          icon={<FiLock/>}
          disabled={isSubmitting}
        />
      </form>
    </div>
  )
}

export default Register;