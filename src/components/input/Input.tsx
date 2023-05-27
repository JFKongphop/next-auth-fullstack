/* Input field for account data */

import React, { useState } from 'react';
import type { 
  FieldValues, 
  UseFormRegister, 
  FieldError, 
  FieldErrorsImpl, 
  Merge 
} from 'react-hook-form';
import { IoAlertCircle } from 'react-icons/io5';
import { ImEye, ImEyeBlocked } from 'react-icons/im';

interface IInput {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  defaultValue: string;
  errors: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  icon: JSX.Element;
  register: UseFormRegister<FieldValues>;
}

const Input: React.FC<IInput> = ({
  name,
  label,
  type,
  placeholder,
  errors,
  defaultValue,
  icon,
  register
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="mt-3 w-full">
      <label 
        htmlFor={name}
        className="text-gray-700"
      >
        {label}
      </label>
      <div className="relative mt-1 rounded-md">
        <div 
          className={`
            pointer-event-none absolute left-0 
            inset-y-0 flex items-center pl-3
            ${errors && '-translate-y-[10px]'}
          `}
        >
          <span className="fill-gray-500 text-sm">{icon}</span>
        </div>
        <input
          className={`
            w-full py-2 pr-7 pl-8 block rounded-md border
            ${errors ? 'border-red-500' : 'border-gray-300 '}
            outline-offset-2 outline-transparent border-2
            text-sm outline-none placeholder:text-gray-300
          `}
          defaultValue={defaultValue}
          type={showPassword ? 'text' : type}
          placeholder={placeholder}
          {...register(name)}
        />
        {
          errors && (
            <IoAlertCircle 
              className="
                fill-red-500 absolute right-2 top-2.5 text-xl
              "
            />
          )
        }
        {/* ----- Show and hide password ----- */}
        {
          (name === 'password' || name === 'confirmPassword') && (
            <div 
              className={`
                absolute top-3 text-x1 
                ${ errors ? 'right-8' : 'right-3' }
                text-gray-700 cursor-pointer
              `}
              onClick={() => setShowPassword(!showPassword)}
            >
              { showPassword ? <ImEye/> : <ImEyeBlocked/> }
            </div>
          )
        }
        {
          errors && (
            <p className="text-[11px] text-red-500 mt-1">
              {errors as string}
            </p>
          )
        }
      </div>
    </div>
  )
}

export default Input;