import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from 'mantine-react-table';
import { Box, Button, Card, Modal, Select, Text, TextInput } from '@mantine/core';
import { IconDownload, IconEdit } from '@tabler/icons-react';
import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here
import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import { AdminServices } from '@/services/admin/AdminServices';
import { CardServices } from '@/services/cards/cardservices';
import AddLoanButton from '../addLoanButton/AddLoanButton';
import UpdateLoanButton from '../updateLoan/UpdateLoanButton';

// Configure CSV export with custom headers
const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: false, // Do not use keys as headers
  columnHeaders: ['ID', 'Nume Complet', 'Email', 'Adresa', 'Telefon'], // Provide the headers explicitly
});

const Example = (props: any) => {
  const { data, setData } = props;
  const [opened, { open, close }] = useDisclosure(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [userCards, setUserCards] = useState<any>([{ value: '', label: '' }]);
    const [lastSelectedUser, setLastSelectedUser] = useState<any>(null);
    const [selectedIban, setSelectedIban] = useState<any>("");
    const [cardBalance, setCardBalance] = useState<any>(0);

    useEffect(() => {
        console.log(cardBalance);
    }, [cardBalance]);

  const form = useForm({
    initialValues: { id: '', name: '', email: '', address: '', phone: '' },

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
      name: (value) => {
        if (!value) {
          return 'Name is required';
        }
        return null;
      },
      address: (value) => {
        if (!value) {
          return 'Address is required';
        }
        return null;
      },
      phone: (value) => {
        if (!value) {
          return 'Phone is required';
        }
        return null;
      },
    },
  });

  // Function to handle update action
  const handleUpdate = (row: any) => {
    setSelectedRow(row);
    form.setValues(row);
    open();
      
    setSelectedIban(undefined);
    setCardBalance(undefined);
  };

  // Handle form submission for updating data
  const handleFormSubmit = (values: any) => {
    AdminServices.updateUser(values).then((res) => {
        console.log(res?.data?.users);
        setData(res?.data?.users)
    }).catch((err) => {
        console.log(err);
    });

    if(selectedIban && cardBalance){
        CardServices.updateIbanBalance({ iban: selectedIban, balance: cardBalance }).then((res) => {
            console.log(res);
            setUserCards(userCards.map((card: any) => {
                if(card.value === selectedIban){
                    return {
                        value: card.value,
                        label: card.label,
                        balance: cardBalance
                    }
                }
                return card;
            }));
        }).catch((err) => {
            console.log(err);
        });
    }
      
    close();
    };
    
    const columns: MRT_ColumnDef<any>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 40,
        },
        {
            accessorKey: 'name',
            header: 'Nume Complet',
            size: 120,
        },
        {
            accessorKey: 'email',
            header: 'Email',
            size: 120,
        },
        {
            accessorKey: 'address',
            header: 'Adresa',
            size: 120,
        },
        {
            accessorKey: 'phone',
            header: 'Telefon',
            size: 120,
        },
        {
            accessorKey: 'actions',
            header: 'Acțiuni',
            size: 120,
            Cell: ({ row }: { row: MRT_Row<any> }) => (
            <Button onClick={() => handleUpdate(row.original)}>
                <IconEdit />
            </Button>
            ),
        },
         {
            accessorKey: 'loans',
            header: 'Împrumuturi',
            size: 120,
             Cell: ({ row }: { row: MRT_Row<any> }) => (
                <div className='flex flex-col'>
                     <AddLoanButton name={row?.original?.name} />
                     <UpdateLoanButton email={row?.original?.email} />
                </div>
            ),
        },
    ];

  // Helper function to map the data to the headers
  const mapDataToHeaders = (data: any) => {
    return data.map((row: any) => ({
      'ID': row?.id,
      'Nume Complet': row?.name,
      'Email': row?.email,
      'Adresa': row?.address,
      'Telefon': row?.phone,
    }));
  };

  const handleExportRows = (rows: MRT_Row<any>[]) => {
    const rowData = mapDataToHeaders(rows.map((row) => row.original));
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(mapDataToHeaders(data));
    download(csvConfig)(csv);
  };

  const table = useMantineReactTable({
    columns,
    data,
    enableRowSelection: true,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button
          color="lightblue"
          // export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
          onClick={handleExportData}
          leftIcon={<IconDownload />}
          variant="filled"
        >
          Export All Data
        </Button>
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          // export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          leftIcon={<IconDownload />}
          variant="filled"
        >
          Export All Rows
        </Button>
        <Button
          disabled={table.getRowModel().rows.length === 0}
          // export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() => handleExportRows(table.getRowModel().rows)}
          leftIcon={<IconDownload />}
          variant="filled"
        >
          Export Page Rows
        </Button>
        <Button
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          // only export selected rows
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          leftIcon={<IconDownload />}
          variant="filled"
        >
          Export Selected Rows
        </Button>
      </Box>
    ),
  });

    const getAccountsForUser = (email: string) => {
        if (email && lastSelectedUser != email) {
            setLastSelectedUser(email);
            CardServices.getUserCards(email).then((res: any) => {
                console.log(res?.data?.cards);
                setUserCards(res?.data?.cards.map((card: any) => {
                    return {
                        value: card?.iban,
                        label: card?.name,
                        balance: card?.balance
                    }
                }));
            }).catch((err: any) => {
                console.log(err);
            });
        }
        return userCards;
    };

  return (
    <React.Fragment>
          <Modal opened={opened} onClose={() => {
                close();
                setSelectedIban(undefined);
                setCardBalance(undefined);
      }} title="Edit Row" radius="lg">
        <Card>
          <form noValidate onSubmit={form.onSubmit((values) => handleFormSubmit(values))}>
            <TextInput
              autoFocus
              className="mt-3"
              name="name"
              label="Nume"
              placeholder="Shopping"
              required
              {...form.getInputProps('name')}
            />
            <TextInput
              className="mt-3"
              name="email"
              label="Email"
              placeholder="example@example.com"
              required
              {...form.getInputProps('email')}
            />
            <TextInput
              className="mt-3"
              name="address"
              label="Adresa"
              placeholder="Adresa"
              required
              {...form.getInputProps('address')}
            />
            <TextInput
              className="mt-3"
              name="phone"
              label="Telefon"
              placeholder="Telefon"
              required
              {...form.getInputProps('phone')}
            />
            <Select
                label="Selectează IBAN-ul contului"
                className="mt-3 text-black"
                placeholder="Pick one"
                data={getAccountsForUser(form.values.email)}
                value={selectedIban}
                onChange={(iban) => {
                    setSelectedIban(iban);
                    setCardBalance(userCards.find((card: any) => card.value === iban)?.balance);
                }}
                      />
            <TextInput
              className="mt-3"
              label="Sold"
              placeholder="xxxx.xx"
              disabled = {selectedIban == undefined}
              value={selectedIban != undefined ? cardBalance : undefined}
              onChange={(e) => setCardBalance(e.currentTarget.value)}
            />
            <Button variant="filled" color="indigo.4" type="submit" fullWidth mt="xl">
              Confirm
            </Button>
          </form>
        </Card>
      </Modal>
      <MantineReactTable table={table} />
    </React.Fragment>
  );
};

export default Example;
