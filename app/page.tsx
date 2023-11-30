'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import SubAccount from '@/components/SubAccount';

export default function Home() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    axios.get('https://api.retool.com/v1/workflows/f21a6ecb-29cb-4356-b09a-018d5eaef774/startTrigger?workflowApiKey=retool_wk_53c0b0fc844e4f168e0fb2abf2183197')
    .then((data: any) => {
      setAccounts(data.data);
    })

    return 
  }, [])

  return (
    <main className="flex flex-col md:p-24 min-h-screen sm:p-5">
      {accounts.map((account: any, index) => 
        <SubAccount 
          key={index} 
          index={index}
          API_KEY={account.API_KEY} 
          PRIVATE_KEY={account.PRIVATE_KEY} 
        />
      )}
    </main>
  )
}
