import NormalHeader from "@/contents/components/header/NormalHeader";
import {Button, UnstyledButton} from "@mantine/core";

export default function EndStartpage(props: any) {
    return (
        <div className="relative w-screen h-screen">
            <img

                className="absolute inset-0 w-screen h-screen object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-between">
                <div className="relative z-10">
                    <div className={'flex justify-left'}>
                        <div className={'ml-20 mt-20'}>
                            <h1 className={'text-7xl text-white'}>SCHIMBĂ FELUL ÎN CARE <br/>ÎȚI GESTIONEZI BANII</h1>
                            <p className={' text-xl text-white -mt-3 '}>
                                Pentru cei ce vă doriți mai mult de la banii voștri -<br/>
                                avem HikeIT.<br/><br/>
                                Înregistrează-te acum, cu un simplu click<br/>
                                <Button variant={'filled'} color={'gray.1'} radius={'xl'} size={'sm'}
                                        className={'mr-8 mt-2 text-black'}>Începe de azi</Button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}