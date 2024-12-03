import { useRouter } from 'next/navigation';
import {useContext, useEffect, useState} from "react";
import Layout from "@/contents/layout/Layout";
import React, { useRef} from 'react';
import {Button, Card, Modal, PasswordInput, ScrollArea, Select, Text, TextInput, UnstyledButton} from "@mantine/core";
import { IconArrowBarRight, IconArrowForwardUp, IconArrowRight } from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import {useForm} from "@mantine/form";
import Link from "next/link";
import {CardServices} from "@/services/cards/cardservices";
import {ProfileContext} from "@/contexts/ProfileContext";
import { LoansServices } from '@/services/loans/loans';

import dynamic from 'next/dynamic';
const EsriMap = dynamic(() => import('@/contents/components/esriMap/esriMap'), { ssr: false });

// Hook
function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        // only execute all the code below in client side
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth as any,
                height: window.innerHeight as any,
            });
        }

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
}

export default function FavoritePage() {
    return (
        <React.Fragment >
            <div>
            <Layout />
            <div className='absolute left-[13.5%] top-[0%] w-[86%]' >
                <EsriMap />
            </div>
            </div>
        </React.Fragment>
    );
}
