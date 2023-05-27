/* Send email to reset password */

import React from 'react';
import Input from '../input/Input';
import SlideButton from '../button/SlideButton';

import { SubmitHandler, useForm } from 'react-hook-form';
import { FiMail, FiLock } from 'react-icons/fi';

import z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, UseFormRegister } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import Link from 'next/link';

const FormSchema = z.object({
  email: z.string().email('Please enter a valid email adress.'),
});

type FormSchemaType = z.infer<typeof FormSchema>;

const Forgot = ({}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema)
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
    try {
      const { data } = await axios.post('/api/auth/forgot', {
        email: values.email
      });
      toast.success(data.message);
    }
    catch (error: any) {
      toast.error(error.response.data.message);
    }
    console.log(values)
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
        Forgot Password
      </h2>
      <p className="text-center text-sm text-gray-600 mt-2">
        Sign In instead ? &nbsp;
        <Link
          className="
            text-blue-600 hover:text-blue-700 
            hover:underline cursor-pointer
          "
          href="/auth"
        >
          Sign Up
        </Link>
      </p>
      <form
        className="my-4 text-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col">
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
        </div>
        <SlideButton
          type="submit"
          text="Send Email"
          slideText="Secure"
          icon={<FiLock/>}
          disabled={isSubmitting}
        />
      </form>
    </div>
  );
}

export default Forgot;