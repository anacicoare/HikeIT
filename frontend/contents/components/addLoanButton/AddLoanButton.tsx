import React from "react";
import { useDisclosure } from '@mantine/hooks';
import {Box, Modal, Group, Button, Card, Container, Image, TextInput, Checkbox} from "@mantine/core";
import {useRouter} from "next/router";
import {useForm} from "@mantine/form";
import {LoansServices} from "@/services/loans/loans";
import {notifications} from "@mantine/notifications";

export default function AddLoanButton(props: any) {
    const [opened, { open, close }] = useDisclosure(false);
    const router = useRouter();
    const {name} = props;

    const form = useForm({
        initialValues: { user: name, iban: '', amount: '', details: '' },

        validate: {
            user: (value) => {
                if (!value) {
                    return 'User is required';
                }
                return null;
            },
            iban: (value) => {
                if (!value) {
                    return 'IBAN is required';
                }
                return null;
            },
            amount: (value) => {
                if (!value) {
                    return 'Amount is required';
                }
                return null;
            },
            details: (value) => {
                if (!value) {
                    return 'Details is required';
                }
                return null;
            },
        },
    });

    const handleSubmit = (values: any) => {
        const data = { user: values?.user, iban: values?.iban, amount: values?.amount, details: values?.details }
        console.log("data", data);
        LoansServices.callApiTransfer(data).then((response: any) => {
            if (response.status === 200) {
                console.log("response", response);
                notifications.show({title: 'Success', message: 'Loan added successfully', color: 'teal'})
                close();
            } else {
                console.error(response);
            }
        }).catch((error: any) => {
            if (error?.response?.status === 400) {
                console.error(error?.response?.data);
                notifications.show({
                    title: 'Error',
                    message: error?.response?.data,
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
            }
        })
    };

    return (
        <React.Fragment>
                    <Modal opened={opened} onClose={close} centered>
                        <Card className="-mt-10" p={20} radius="md">
                            <h2>Aprobă un împrumut</h2>
                            <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
                                <TextInput
                                    autoFocus
                                    name='user'
                                    label="Client"
                                    placeholder="Introduce numele clientului"
                                    required {...form.getInputProps('user')}
                                    className={'mt-3'}
                                />
                                <TextInput
                                    mt={'md'}
                                    name='iban'
                                    label="IBAN client"
                                    placeholder="Introduce IBAN-ul clientului"
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
                                    label="Detalii"
                                    placeholder="Detalii despre împrumut"
                                    required {...form.getInputProps('details')}
                                />
                                <Checkbox
                                    label="Am verificat datele clientului și sunt de acord cu împrumutul."
                                    color="violet"
                                    required
                                    className={'mt-3'}
                                />
                                <Button variant="filled" color={'indigo.4'} type='submit' fullWidth mt="xl">
                                    Aprobă împrumutul
                                </Button>
                            </form>
                        </Card>
                    </Modal>

                    <Button onClick={open} className="bg-violet-400 hover:bg-violet-600">Aprobă un împrumut</Button>

        </React.Fragment>
    );
}
