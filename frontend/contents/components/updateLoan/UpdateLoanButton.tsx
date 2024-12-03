import { LoansServices } from "@/services/loans/loans";
import { Button, Card, Modal, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function UpdateLoanButton(props: any) {
    const [opened, { open, close }] = useDisclosure(false);
    const router = useRouter();
    const { email } = props;
    const [ibanData, setIbanData] = useState<any>([{ value: '', label: '' }]);
    const [selectedIbanId, setSelectedIban] = useState<any>('');

    useEffect(() => {
        if (email) {
            LoansServices.getAllLoans(email).then((response: any) => {
                if (response.status === 200) {
                    console.log("response", response.data);
                    const data = response?.data?.loans;
                    const ibanData = data.map((item: any) => {
                        return { value: item.id, label: item.iban }
                    })
                    setIbanData(ibanData);
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
                    })
                }
            })
        }
    }, [opened, email])

    const form = useForm({
        initialValues: {id: '', amount: ''},
        
        validate: {
            amount: (value: any) => {
                if (!value) {
                    return 'Amount is required';
                }
                return null;
            },
        },
    });

    const handleSubmit = (values: any) => {
        const data = {id: selectedIbanId, amount: values?.amount}
        console.log("data", data);
        LoansServices.updateLoan(data, email).then((response: any) => {
            if (response.status === 200) {
                console.log("response", response);
                notifications.show({ title: 'Succes', message: 'Împrumutul a fost actualizat cu succes.', color: 'teal' })
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
                })
            }
        })
    }

    return (
        <React.Fragment>
            <Button
                variant={'filled'}
                color={'lime.4'}
                size={'sm'}
                className={'mt-3.5'}
                onClick={open}
            >
                Achită rată
            </Button>
            <Modal opened={opened} onClose={close} centered title={email}>
                <Card className="-mt-10" p={20} radius="md">
                <h2>Depune sold</h2>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                   <Select
                    label="Selectează IBAN-ul contului"
                    className="mt-3 text-black"
                    placeholder="Pick one"
                    data={ibanData}
                    value={selectedIbanId}
                    onChange={(iban) => {
                        setSelectedIban(iban);
                    }}
                      />
                    <TextInput
                        label="Amount"
                        placeholder="Amount"
                        required
                        value={form.values.amount}
                        onChange={(event) => form.setFieldValue('amount', event.currentTarget.value)}
                        error={form.errors.amount}
                            onFocus={form.reset}
                            className="mt-4"
                    />
                    <Button type="submit" variant="filled" className={'mt-10 object-center ml-[35%]'}>
                        Confirm
                    </Button>
                    </form>
                </Card>
            </Modal>
        </React.Fragment>
    )
};