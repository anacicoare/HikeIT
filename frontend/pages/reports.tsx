import React, { useContext, useEffect, useState } from 'react';
import Layout from "@/contents/layout/Layout";
import { useRouter } from "next/router";
import { Container, Card, Box, Text, ScrollArea } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Table from "@/contents/components/table/Table";
import { ProfileContext } from "@/contexts/ProfileContext";
import { ReportServices } from "@/services/reports/reportServices";

function formatDateToYYYYMMDD(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function ReportsPage() {
    const router = useRouter();
    const profile = useContext(ProfileContext);
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const profileData = localStorage.getItem('profile');
        if (!profileData) {
            router?.push('/login');
        }
    }, [router]);

    useEffect(() => {
        const fetchReports = async () => {
            if (profile?.profile?.email) {
                try {
                    const response = await ReportServices.callApiGetReports(profile?.profile?.email);
                    const formattedReports = response.data.map(report => {
                        const amount = report.sender == profile?.profile?.name ? -report.amount : report.amount;
                        return { ...report, amount };
                    });
                    setReports(formattedReports);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching reports:', error);
                    notifications.show({
                        title: 'Error',
                        message: 'Eroare la obținerea rapoartelor',
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
                    setLoading(false);
                }
            }
        };

        fetchReports();
    }, [profile]);

    return (
        <React.Fragment>
            <div
                className="h-1/2 w-full bg-cover bg-center"
                style={{backgroundImage: 'url("city.jpg")'}}>
                <Layout/>
                <div className='absolute left-[18%] top-[7%] mt-7 w-[82%]'>
                    <Container className="form-container"
                               style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Box className='w-full'>
                            <Card withBorder shadow="xl" p={20} mt={30} radius="md">
                                <h1>Rapoarte</h1>
                                {loading ? (
                                    <Text>Loading...</Text>
                                ) : (
                                        <Table data={reports.map((report: any) => {
                                            return {
                                                date: formatDateToYYYYMMDD(report.date),
                                                receiver: report.receiver,
                                                amount: report.amount,
                                            };
                                    })}/>
                                )}
                            </Card>
                        </Box>
                    </Container>
                </div>
            </div>
        </React.Fragment>
);
}
