import {
    TextInput,
    PasswordInput,
    Paper,
    Title,
    Text,
    Container,
    Button,
    Divider,
    Box, Select
} from '@mantine/core';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from '@mantine/form';
import {useContext, useState} from 'react';
import { ProfileContext } from '@/contexts/ProfileContext';
import { useRouter } from 'next/router';
import bg from '../public/startpage_bg.jpg';

/**
 * Login page
 * Use mantine form to validate
 */

const userTypes = [
    {value: 'normal', label: 'Persoană fizică'},
    {value: 'producer', label: 'Persoană juridică'},
]

export default function LoginPage() {
    const { login } = useContext(ProfileContext)
    const selectedUserType = "normal"
    const router = useRouter();

    const form = useForm({
        initialValues: { email: '', password: '' },

        // functions will be used to validate values at corresponding key
        validate: {
            email: (value) => {
                if (!value) {
                    return 'Email is required';
                }
                if (value !== '' && !value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
                    return 'Please enter a valid email address.';
                }
                return null;
            },
            password: (value) => {
                if (!value) {
                    return 'Password is required';
                }
                return null;
            }
        },
    });

    const handleSubmit = (values: any) => {
        login({ email: values?.email, password: values?.password, user_type: selectedUserType })
    }

    return (
        <div
            className='flex justify-center items-stretch position-absolute bg-cover bg-center bg-no-repeat w-screen h-screen'
            style={{backgroundImage: `url(${bg.src})`}}>
            <Box className='w-3/5 position-absolutess mt-10'>
                <Container size={450} my={40}>
                    <Paper withBorder shadow="md" p={30} mt={10} radius="md">
                        <h1>Intră în cont</h1>
                        <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
                            <TextInput
                                autoFocus
                                className={'mt-3'}
                                name='email'
                                label="Email"
                                placeholder="example@domain.com"
                                required {...form.getInputProps('email')}
                            />
                            <PasswordInput
                                label="Parolă"
                                name='password'
                                placeholder="Enter password"
                                required {...form.getInputProps('password')}
                                mt="md" />
                            <Button variant="filled" color={'indigo.4'} type='submit' fullWidth mt="xl">
                                Confirm
                            </Button>
                            <Link href={'/register'}>
                                <Text className="-mb-3" size="sm" align="center" mt="md" variant="link">Nu ai încă un cont? Înregistrează-te aici</Text>
                            </Link>
                            <Link href={'/'}>
                                <Text className="-mb-3" size="sm" align="center" mt="md" variant="link">Întoarce-te la pagina principală</Text>
                            </Link>
                        </form>
                    </Paper>
                </Container>
            </Box>
        </div>
    );
}
