import {Avatar, Button, Card, Divider, Text, UnstyledButton} from "@mantine/core";
import React, {useContext, useEffect} from "react";
import {useRouter} from "next/router";
import {ProfileContext} from "@/contexts/ProfileContext";
import {usePathname} from "next/navigation";

export default function Header() {
  /**
   * Reload the page with the latest data
   */
    const router = useRouter();
    const profile = useContext(ProfileContext);
    const pathname = usePathname();

    useEffect(() => {
        console.log("profile", profile);

        if (pathname === '/' && profile?.profile?.email) {
            router.push('/map')
        }
    }, []);

  return (
      <React.Fragment>
      <div className='flex h-[60px] justify-between w-[90%] bg-transparent'>
          <div >
              {profile?.profile?.email ? (pathname.includes('favorite') && <h2 className={'text-white font-semibold ml-10 mt-3'}>Bine ai revenit</h2>) :
                  <h2 className={'text-white font-semibold ml-10 mt-3'}>HikeIT</h2>}
          </div>
          <div className={'flex flex-row'}>
              {profile?.profile?.email ?   
              <UnstyledButton onClick={() => {router.push('/profile')}}><Avatar radius="xl"  className={'text-black mt-1'}/> </UnstyledButton>: <Button variant={'outline'} color={'gray.1'} radius={'xl'} size={'sm'} className={'mt-4 mr-3'}
                       onClick={() => {
                           router.push('/login')
                       }}>Intră în cont</Button>}
              {profile?.profile?.email ?  <Text className={`text-white font-semibold ml-2 mt-5`}> {profile?.profile?.name} </Text> :
                  <Button variant={'filled'} color={'gray.1'} radius={'xl'} size={'sm'} className={'text-black -mr-16 mt-3.5'} onClick={() => {router.push('/register')}}>Înregistrează-te acum</Button>}
          </div>
      </div>
          <Divider color={'white'} size={'sm'} className={'ml-10 mr-10'}/>
      </React.Fragment>
  );
}
