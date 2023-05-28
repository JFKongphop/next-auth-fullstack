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
import { useRouter } from 'next/router';


interface IEdit {
  token: string;
}

export type UserDefault = {
  firstname: string;
  lastname: string;
  phone: string;
}

export type UserResponse = {
  firstname: string;
  lastname: string;
  phone: string;
  image: string;
}

const Edit: React.FC<IEdit>  = ({ token }) => {
  const [userDefault, setUserDefault] = useState<UserResponse>({ 
    firstname: '', 
    lastname: '', 
    phone: '',
    image: '',
  });
  const [logoImage, setLogoImage] = useState<File | null | undefined>(null);
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<UserDefault>();

  const router = useRouter();

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
      const { data } = await axios.post<{ message: string }>('/api/edit/edit', {
        ...defaultValues,
        image,
        token,
        oldUrl: userDefault.image.slice(61, userDefault.image.length - 4)
      });

      toast.success(data.message);
      router.push('/'); 
    }
    catch (error: any) {
      toast.error(error.response.data.message)
    }
  };

  useEffect(() => {
    const userDataHandler = async () => {
      try {
        const { data } = await axios.post<UserResponse>('/api/edit/profile', { token });
        setUserDefault(data);
      }
      catch (error) {
        console.log(error);
      }
    }

    userDataHandler();
  }, [userDefault]);

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
      <div className="w-full flex justify-center my-5">
        <img
          src={logoImage
            ? URL.createObjectURL(logoImage) 
            : userDefault.image
          }
          alt={`image`}
          className="rounded-full h-40 w-40 border-2 border-black"
        />
      </div>
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
        <div className="mt-4">
          <p>Profile Image</p>
          <div
            className="
              inline-block relative overflow-hidden 
              w-full rounded-md cursor-pointer py-2
              border-2 border-solid border-gray-300
              mt-1
            "
          >
            <input
              className="absolute opacity-0"
              type="file"
              placeholder="upload"
              onChange={(e) => {
                setLogoImage(e.target.files?.[0]);
                const reader = new FileReader();
                reader.readAsDataURL(e.target.files?.[0] as File);
                reader.onloadend = () => {
                  setImage(reader.result);
                }
              }} 
            />
            <label
              className="
                font-semibold z-0 cursor-pointer
                text-blueOcare flex justify-center 
                items-center
              "
            >
              Upload Profile
            </label>
          </div>
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