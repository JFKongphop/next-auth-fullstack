/* Edit */

import React, { useEffect, useState } from 'react';
import Input from '../input/Input';
import SlideButton from '../button/SlideButton';

import { SubmitHandler, useForm } from 'react-hook-form';
import { CiUser } from 'react-icons/ci';
import { FiLock } from 'react-icons/fi';
import { BsTelephone } from 'react-icons/bs';

import type { FieldValues, UseFormRegister } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';


interface IEdit {
  token: string;
}

export type UserDefault = {
  firstname: string;
  lastname: string;
  phone: string;
}

const Edit: React.FC<IEdit>  = ({ token }) => {
  const [userDefault, setUserDefault] = useState<UserDefault>({ 
    firstname: '', 
    lastname: '', 
    phone: '' 
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<UserDefault>();

  const onSubmit: SubmitHandler<UserDefault> = async (values) => {
    const defaultValues: UserDefault = {
      firstname: values.firstname 
        ? values.firstname 
        : userDefault.firstname,
      lastname: values.lastname
        ? values.lastname
        : userDefault.lastname,
      phone: values.phone
        ? values.phone
        : userDefault.phone
    };

    try {
      const { data } = await axios.post<{ message: string }>('/api/edit', {
        ...defaultValues,
        token
      });
      toast.success(data.message);
    }
    catch (error: any) {
      toast.error(error.response.data.message)
    }
  };

  useEffect(() => {
    const userDataHandler = async () => {
      try {
        const { data } = await axios.post<UserDefault>('/api/edit/profile', { token });
        setUserDefault(data);
      }
      catch (error) {
        console.log(error);
      }
    }
    userDataHandler();
  }, [userDefault])

  return (
    <div className="w-[50%] px-12 py-2">
      <h2 
        className="
          text-center text-2xl font-bold 
          tracking-wide text-gray-800
          w-full
        "
      >
        Edit Profile {userDefault.firstname}
      </h2>
      <form 
        className="my-2 text-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="gap-2 md:flex">
          <Input 
            name="firstname"
            label="Firstname"
            type="text"
            placeholder={userDefault.firstname}
            errors={errors?.firstname?.message}
            icon={<CiUser />}
            register={register as unknown as UseFormRegister<FieldValues>} 
            defaultValue={userDefault.firstname}          
          />
          <Input 
            name="lastname"
            label="Lastname"
            type="text"
            placeholder={userDefault.lastname}
            errors={errors?.lastname?.message}
            icon={<CiUser />}
            register={register as unknown as UseFormRegister<FieldValues>} 
            defaultValue={userDefault.lastname}          
          />
        </div>
        <div className="flex flex-col">
          <Input 
            name="phone"
            label="Phone number"
            type="text"
            placeholder={userDefault.phone}
            errors={errors?.phone?.message}
            icon={<BsTelephone />}
            register={register as unknown as UseFormRegister<FieldValues>} 
            defaultValue={userDefault.phone}          
          />
        </div>
        <SlideButton
          type="submit"
          text="Save"
          slideText="Submit"
          icon={<FiLock/>}
          disabled={isSubmitting}
        />
      </form>
    </div>
  )
}

export default Edit;