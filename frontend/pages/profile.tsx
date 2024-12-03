import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Text, Button, Group, Avatar } from '@mantine/core';
import bg from '../public/startpage_bg.jpg';
import { ProfileServices } from '@/services/profile/profile';
import { ProfileContext } from '@/contexts/ProfileContext';
import router from 'next/router';

export default function ProfilePage() {
    const [userData, setUserData] = useState<any>(null);
    const profile = useContext(ProfileContext);

    useEffect(() => {
        if(profile?.profile?.email != undefined) {
            ProfileServices.callApiGetUserData(profile?.profile?.email).then((response: any) => {
                if (response && response?.data) {
                    setUserData(response?.data);
                } else {
                    console.log("failed");
                }
            }).catch((error: any) => {
                console.error(error);
            });
        }
        }, [profile?.profile?.email]);

    return (
        <div className="h-screen relative">
            {/* Top half with the background image */}
            <div 
                className="h-1/2 w-full bg-cover bg-center" 
                style={{ backgroundImage: `url(${bg.src})` }}
            />

            {/* Centered card */}
            <div className="absolute inset-0 flex justify-center items-center">
                <Card shadow="sm" padding="xl" radius="md" withBorder className="w-full max-w-3xl">
                    <Group position="center" mt="md">
                        <Avatar src='user.png' alt="User" radius="xl" size="xl" />
                    </Group>

                    <Group mt="md" mb="xs" className="flex items-center" position="center">
                        <Text weight={500} size="xl" className="p-px">Nume:</Text>
                        <Text weight={500} size="xl" color="dimmed" className="ml">{userData?.name}</Text>
                    </Group>

                    <Group mt="md" mb="xs" className="flex items-center" position="center">
                        <Text weight={500} size="xl" className="p-px">Email:</Text>
                        <Text weight={500} size="xl" color="dimmed" className="ml">{userData?.email}</Text>
                    </Group>

                    <Group mt="md" mb="xs" className="flex items-center" position="center">
                        <Text weight={500} size="xl" className="p-px">Tip cont:</Text>
                        <Text weight={500} size="xl" color="dimmed" className="ml">{userData?.is_admin ? 'Admin' : 'Normal'}</Text>
                    </Group>

                    <Group mt="md" mb="xs" className="flex items-center" position="center">
                        <Text weight={500} size="xl" className="p-px">Telefon:</Text>
                        <Text weight={500} size="xl" color="dimmed" className="ml">nr</Text>
                    </Group>

                    <Group mt="md" mb="xs" className="flex items-center" position="center">
                        <Text weight={500} size="xl" className="p-px">Domiciliu:</Text>
                        <Text weight={500} size="xl" color="dimmed" className="ml">adresa</Text>
                    </Group>

                    <div className="flex justify-end mt-4">
                        <Button variant="filled" color={'indigo.4'} onClick={() => {router.push('/favorite')}}>
                            Confirm
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
