import React from 'react';
import {Badge, Button, Card, Container, Group, UnstyledButton, Image, Text} from '@mantine/core';
import Header from "@/contents/components/header/Header";
import {IconChevronDown, IconMap, IconCompass, IconMountain, IconTent, IconCampfire} from "@tabler/icons-react";
import { Carousel } from '@mantine/carousel';
import {useRouter} from "next/router";

const IndexPage = () => {
    const scrollToNextSection = () => {
        const nextSection = document.getElementById('next-section');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const router = useRouter();

    return (
        <div>

            <div className="bg-cover bg-center h-screen flex" style={{ backgroundImage: 'url("forest.jpg")' }}>
                <div className={'w-full'}>
                    <Header />
                    <div className={'ml-20 mt-28'}>
                        <h1 className={'text-7xl text-white'}>MENȚINE UN STIL DE VIAȚĂ ACTIV <br />ORIUNDE AI FI</h1>
                        <p className={' text-xl text-white -mt-3 '}>
                            Pentru cei ce vă doriți mai mult de la vacanțele voastre -<br />
                            avem HikeIT.<br /><br />
                            Începe acum.<br />
                            <Button variant={'filled'} color={'gray.1'} radius={'xl'} size={'sm'}
                                    className={'mr-8 mt-2 text-black'} onClick={() => {router.push('/register')}}>Explorează drumeții din parcurile naționale din Statele Unite</Button>
                        </p>
                    </div>
                </div>
                {/* Move the IconChevronDown inside the div containing the first section content */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
                    <UnstyledButton onClick={scrollToNextSection}>
                        <IconChevronDown className={'text-white font-bold'} size={'50px'} />
                    </UnstyledButton>
                </div>
            </div>

            <div className="bg-gray-100 py-20 h-screen" id="next-section">
                <Container size="xl">
                    <h2 className="text-3xl font-bold text-center text-green-700 mb-8 -mt-8">De ce să alegi HikeIT?</h2>
                    <p className="text-lg text-center text-gray-600 mb-10">
                        Descoperă o lume de aventuri și experiențe unice în natură. HikeIT te ajută să găsești traseele ideale,
                        să navighezi fără griji și să creezi amintiri de neuitat.
                    </p>
                    <div className={'w-full flex justify-center'}>
                        <Group>
                            <div className={'w-[200px] h-[150px]'}>
                                <div className={'flex justify-center'}>
                                    <IconMap size={50} color={'#136e2e'} />
                                </div>
                                <Text align={'center'} className={'mt-1'}>Explorează trasee personalizate</Text>
                            </div>
                            <div className={'w-[200px] h-[150px]'}>
                                <div className={'flex justify-center'}>
                                    <IconCompass size={50} color={'#136e2e'} />
                                </div>
                                <Text align={'center'} className={'mt-1'}>Navighează cu încredere</Text>
                            </div>
                            <div className={'w-[200px] h-[150px]'}>
                                <div className={'flex justify-center'}>
                                    <IconMountain size={50} color={'#136e2e'} />
                                </div>
                                <Text align={'center'} className={'mt-1'}>Descoperă peisaje uimitoare</Text>
                            </div>
                            <div className={'w-[200px] h-[150px]'}>
                                <div className={'flex justify-center'}>
                                    <IconTent size={50} color={'#136e2e'} />
                                </div>
                                <Text align={'center'} className={'mt-1'}>Planifică excursii memorabile</Text>
                            </div>
                            <div className={'w-[200px] h-[150px]'}>
                                <div className={'flex justify-center'}>
                                    <IconCampfire size={50} color={'#136e2e'} />
                                </div>
                                <Text align={'center'} className={'mt-1'}>Creează amintiri alături de prieteni</Text>
                            </div>
                        </Group>
                    </div>
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        <Card
                            shadow="sm"
                            padding="xl"
                            radius="lg"
                            className="w-[350px] mx-auto flex flex-col justify-between h-[270px]"
                        >
                            <div>
                                <h1 className="font-bold text-lg mb-4">Planifici o aventură de weekend?</h1>
                                <p className="text-gray-600">
                                    HikeIT îți oferă cele mai bune sugestii pentru trasee scurte, perfecte pentru o evadare rapidă în natură.
                                </p>
                            </div>
                            <Button variant="light" color="green" fullWidth mt="md" radius="md">
                                Găsește trasee
                            </Button>
                        </Card>

                        <Card
                            shadow="sm"
                            padding="xl"
                            radius="lg"
                            className="w-[350px] mx-auto flex flex-col justify-between h-[270px]"
                        >
                            <div>
                                <h1 className="font-bold text-lg mb-4">Te pregătești pentru o expediție?</h1>
                                <p className="text-gray-600">
                                    Descoperă sfaturi utile și resurse pentru a te echipa și organiza eficient pentru excursii lungi.
                                </p>
                            </div>
                            <Button variant="light" color="green" fullWidth mt="md" radius="md">
                                Vezi detalii
                            </Button>
                        </Card>

                        <Card
                            shadow="sm"
                            padding="xl"
                            radius="lg"
                            className="w-[350px] mx-auto flex flex-col justify-between h-[270px]"
                        >
                            <div>
                                <h1 className="font-bold text-lg mb-4">Ai nevoie de inspirație?</h1>
                                <p className="text-gray-600">
                                    Explorează cele mai frumoase locuri recomandate de comunitatea HikeIT și lasă-te inspirat!
                                </p>
                            </div>
                            <Button variant="light" color="green" fullWidth mt="md" radius="md">
                                Descoperă locuri
                            </Button>
                        </Card>
                    </div>
                </Container>
            </div>


            {/* Add more sections as needed */}

        </div>
    );
};

export default IndexPage;
