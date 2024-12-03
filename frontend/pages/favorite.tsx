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
    const router = useRouter();
    const [opened, { open, close }] = useDisclosure(false);
    const [showCardDetails, setShowCardDetails] = useState(false);
    const size = useWindowSize();
    const [selectedCardType, setSelectedCardType] = useState<any>('');
    const profile = useContext(ProfileContext);
    const [cards, setCards] = useState<any>([]);
    const [selectedCardDetails, setSelectedCardDetails] = useState<any>({});
    const [totalAmount, setTotalAmount] = useState(0);
    const [loans, setLoans] = useState<any>([]);

    const handleSubmit = (values: any) => {
        CardServices.callApiCreateCard({name: values?.name, type: selectedCardType, email: profile?.profile?.email}).then((response: any) => {
            if (response && response?.data) {
                setCards(response?.data?.cards);
                response?.data?.cards.forEach((card: any) => {
                    setTotalAmount(totalAmount + card?.balance);
                });
                close();
            } else {
                console.log("failed");
            }
        }).catch((error: any) => {
            console.error(error);
        });
    }

    const form = useForm({
        initialValues: { name: ''},

        // functions will be used to validate values at corresponding key
        validate: {
            name: (value) => {
                if (!value) {
                    return 'Name is required';
                }
               return null;
            }
        },
    });

    useEffect(() => {
        console.log('here')
        const profile: any = localStorage.getItem('profile');
        if (!profile) {
            console.log('no access token')
            router?.push('/login');
        } else {
            console.log('have access token')
        }
    }, []);

    useEffect(() => {
        if(profile?.profile?.email != undefined) {
            CardServices.callApiGetCards(profile?.profile?.email).then((response: any) => {
                if (response && response?.data) {
                    setCards(response?.data?.cards);
                    let total = 0;
                    response?.data?.cards.forEach((card: any) => {
                        total += parseFloat(card?.balance);
                    });
                    setTotalAmount(total);
                } else {
                    console.log("failed");
                }
            }).catch((error: any) => {
                console.error(error);
            });
        }
    }, [profile?.profile?.email]);


    useEffect(() => {
        if (profile?.profile?.email) {
            LoansServices.getAllLoans(profile?.profile?.email).then((response: any) => {
                if (response.status === 200) {
                    console.log("response", response.data);
                    setLoans(response?.data?.loans);
                } else {
                    console.error(response);
                }
            }).catch((error: any) => {
                if (error?.response?.status === 400) {
                    console.error(error?.response?.data);
                }
            });
        }
    }, [profile?.profile?.email]);

    return (
        <React.Fragment >
            <div style={{ backgroundImage: 'url("forest.jpg")' }}>
            <Layout />
            

            </div>
        </React.Fragment>
    );
}
