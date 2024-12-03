import {Button, Card, Divider} from "@mantine/core";
import React from "react";

export default function NormalHeader() {
    /**
     * Reload the page with the latest data
     */

    return (
        <React.Fragment>
            <Card className='flex h-[60px] justify-between w-screen bg-blue-900'>
                <div className={'pl-6'}>
                    <h2 className={'text-white mt-0 ml-3 font-semibold'}>HikeIT</h2>
                </div>
                <div>
                    <Button variant={'outline'} color={'gray.1'} radius={'xl'} size={'sm'} className={'mr-2'}>Intră în cont</Button>
                    <Button variant={'filled'} color={'gray.1'} radius={'xl'} size={'sm'} className={'mr-8 text-black'}>Înregistrează-te acum</Button>
                </div>
            </Card>
            <Divider color={'white'} size={'sm'}/>
        </React.Fragment>
    );
}
