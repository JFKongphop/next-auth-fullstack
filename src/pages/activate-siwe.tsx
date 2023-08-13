import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react'
import { toast } from 'react-toastify';

const activateSiwe = () => {
  const { data: session} = useSession();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.put('/api/auth/activate-siwe', { 
          address: session?.address 
        });
        toast.success(data.message);
      }
      catch (error: any) {
        toast.error((error?.response?.data).message);
      }
    })();
  }, [session])

  return (
    <div>
      AVTIVATE PAGE
    </div>
  )
}

export default activateSiwe