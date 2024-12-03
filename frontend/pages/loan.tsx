import React from "react";
import Layout from "@/contents/layout/Layout";
import { useDisclosure } from '@mantine/hooks';
import {Box, Modal, Group, Button, Card, Container, Image, TextInput, Checkbox} from "@mantine/core";
import {useRouter} from "next/router";
import {useForm} from "@mantine/form";
import {LoansServices} from "@/services/loans/loans";
import {notifications} from "@mantine/notifications";
import AddLoanButton from "@/contents/components/addLoanButton/AddLoanButton";

export default function Loan() {

    return (
        <React.Fragment>
            <Layout />
            <AddLoanButton />
        </React.Fragment>
    );
}
