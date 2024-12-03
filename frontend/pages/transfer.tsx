import React, { useContext, useEffect, useState } from 'react';
import Layout from "@/contents/layout/Layout";
import { useRouter } from "next/router";
import { Box, Button, Container, Paper, Image, PasswordInput, Select, Text, TextInput, Card } from "@mantine/core";
import Link from "next/link";
import { ProfileContext } from "@/contexts/ProfileContext";
import { useForm } from "@mantine/form";
import { TransferServices } from "@/services/transfer/transferservices";
import { notifications } from "@mantine/notifications";
import { CardServices } from "@/services/cards/cardservices";

export default function TransferPage() {
    const router = useRouter();
    const profile = useContext(ProfileContext);
    const [selectedCard, setSelectedCard] = useState<any>('');
    const [cards, setCards] = useState<any>([]);

    useEffect(() => {
        console.log('here')
        const profile: any = localStorage.getItem('profile');
        if (!profile) {
            console.log('no access token')
            router?.push('/login');
        } else {
            console.log('have access token')
            console.log(profile?.profile?.email);
        }
    }, [profile, router]);

    // get request from backend to get user's cards
    useEffect(() => {
        if(profile?.profile?.email != undefined) {
            console.log("call api get cards...");
            CardServices.callApiGetCards(profile?.profile?.email).then((response: any) => {
                if (response && response?.data) {
                    setCards(response?.data.cards);
                    console.log("get cards success");
                } else {
                    console.log("get cards failed");
                }
            }).catch((error: any) => {
                console.error(error);
            })
        }
    }, [profile?.profile?.email]);


    const form = useForm({
        initialValues: { amount: '', details: '', iban: '', receiver: '' },

        // functions will be used to validate values at corresponding key
        validate: {
            amount: (value) => {
                if (!value) {
                    return 'Suma este necesară';
                }
                if (value !== '' && !value.match(/^[0-9]+$/g)) {
                    return 'Introduceți o sumă validă';
                }
                return null;
            },
            details: (value) => {
                if (!value) {
                    return 'Detaliile sunt necesare';
                }
                return null;
            },
            iban: (value) => {
                if (!value) {
                    return 'IBAN-ul este necesar';
                }
                if (value == '' && !value.match(/^[A-Z]{2}\d{2}[A-Z\d]{1,30}$/)) {
                    return 'Introduceți un IBAN valid';
                }
                return null;
            },
            receiver: (value) => {
                if (!value) {
                    return 'Numele destinatarului este necesar';
                }
                return null;
            },
        },
    });

    const handleSubmit = (values: any) => {
        const data = { amount: values?.amount, details: values?.details, iban: values?.iban,
            receiver: values?.receiver, iban_sender: selectedCard, sender: profile?.profile?.name };
        console.log("call api transfer...");
        TransferServices.callApiTransfer(data).then((response: any) => {
            if (response && response?.data) {
                console.log("transfer success");
                router.push('/favorite');
                notifications.show({
                    title: 'Succes',
                    message: 'Transfer realizat cu succes',
                    color: 'green',
                    withBorder: true,
                    styles: (theme) => ({
                        root: {
                            backgroundColor: theme.colors.green[6],
                            borderColor: theme.colors.green[6],

                            '&::before': { backgroundColor: theme.white },
                        },

                        title: { color: theme.white },
                        description: { color: theme.white },
                        closeButton: {
                            color: theme.white,
                            '&:hover': { backgroundColor: theme.colors.blue[7] },
                        },
                    }),
                })
            } else {
                console.log("transfer failed");
                notifications.show(
                    {
                        title: 'Error',
                        message: 'Transfer eșuat',
                        color: 'red',
                        withBorder: true,
                        styles: (theme) => ({
                            root: {
                                backgroundColor: theme.colors.red[6],
                                borderColor: theme.colors.red[6],

                                '&::before': { backgroundColor: theme.white },
                            },

                            title: { color: theme.white },
                            description: { color: theme.white },
                            closeButton: {
                                color: theme.white,
                                '&:hover': { backgroundColor: theme.colors.blue[7] },
                            },
                        }),
                    }
                )
            }
        }).catch((error: any) => {
            if (error?.response?.status === 400) {
                console.log("transfer failed because");
                console.log(error?.response?.data);
                notifications.show({
                    title: 'Error',
                    message: 'Fonduri insuficiente',
                    color: 'red',
                    withBorder: true,
                    styles: (theme) => ({
                        root: {
                            backgroundColor: theme.colors.red[6],
                            borderColor: theme.colors.red[6],

                            '&::before': { backgroundColor: theme.white },
                        },

                        title: { color: theme.white },
                        description: { color: theme.white },
                        closeButton: {
                            color: theme.white,
                            '&:hover': { backgroundColor: theme.colors.blue[7] },
                        },
                    }),
                })
            } else {
                console.error(error);
                notifications.show({
                    title: 'Error',
                    message: 'Transfer eșuat',
                    color: 'red',
                    withBorder: true,
                    styles: (theme) => ({
                        root: {
                            backgroundColor: theme.colors.red[6],
                            borderColor: theme.colors.red[6],

                            '&::before': { backgroundColor: theme.white },
                        },

                        title: { color: theme.white },
                        description: { color: theme.white },
                        closeButton: {
                            color: theme.white,
                            '&:hover': { backgroundColor: theme.colors.blue[7] },
                        },
                    }),
                });
            }
        })
    }

    return (
        <React.Fragment>
            <div
                className="h-1/2 w-full bg-cover bg-center"
                style={{backgroundImage: 'url("startpage_bg.jpg")'}}>
                <Layout/>
                <div className='absolute left-[18%] top-[7%] mt-7 w-[82%]'>
                    <Container className="form-container"
                               style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Box className='w-1/2 position-absolutess m-5'>
                            <Card withBorder shadow="xl" p={20} mt={30} radius="md">
                                <h1>Plată nouă</h1>
                                <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
                                    <Select
                                        data={cards.map((card: any) => ({label: card.iban, value: card.iban}))}
                                        label="Cont curent"
                                        placeholder="Selectează contul curent"
                                        value={selectedCard}
                                        onChange={(value: any) => setSelectedCard(value)}
                                        mt="md"
                                        required={true}
                                    />
                                    <TextInput
                                        autoFocus
                                        name='receiver'
                                        label="Beneficiar"
                                        placeholder="Introduce numele beneficiarului"
                                        required {...form.getInputProps('receiver')}
                                        className={'mt-3'}
                                    />
                                    <TextInput
                                        mt={'md'}
                                        name='iban'
                                        label="IBAN beneficiar"
                                        placeholder="Introduce IBAN-ul beneficiarului"
                                        required {...form.getInputProps('iban')}
                                    />
                                    <TextInput
                                        autoFocus
                                        name='amount'
                                        label="Sumă"
                                        placeholder="0 RON"
                                        required {...form.getInputProps('amount')}
                                        className={'mt-3'}
                                    />
                                    <TextInput
                                        mt={'md'}
                                        name='details'
                                        label="Detalii plată"
                                        placeholder="Transfer"
                                        required {...form.getInputProps('details')}
                                    />
                                    <Button variant="filled" color={'indigo.4'} type='submit' fullWidth mt="xl">
                                        Continuă
                                    </Button>
                                </form>
                            </Card>
                        </Box>
                        {/* Add image */}
                        <Image className={"m-10 mt-15"} src={'/transfer_bani.svg'} alt={'transfer'}
                               style={{width: "45%"}}/>
                    </Container>
                </div>
            </div>
                {/*</Layout>*/}
        </React.Fragment>
);
}
