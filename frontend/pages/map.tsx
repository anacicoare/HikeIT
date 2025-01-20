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
