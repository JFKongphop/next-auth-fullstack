import { NextPageContext } from 'next';
import React from 'react'
import EditForm from '@/components/forms/Edit';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const Edit = () => {
  const router = useRouter();

  return (
    <div className="
        min-h-screen flex items-center justify-center
      "
    >
      <div className="w-full">
        <div 
          className="
            relative 
            flex flex-col w-full rounded-lg
             justify-center items-center
          "
        >
          <EditForm token={router.query.token as string}/>
        </div>
      </div>
    </div>
  )
}

export default Edit;

export function getServerSideProps(ctx: NextPageContext) {
  const { query } = ctx;
  const token = query.token;
  // console.log('token', token)
  return {
    props: { token }
  }
}