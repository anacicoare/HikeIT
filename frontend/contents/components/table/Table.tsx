import {
    MantineReactTable,
    useMantineReactTable,
    type MRT_ColumnDef,
    type MRT_Row,
} from 'mantine-react-table';
import { Box, Button } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here

const columns: MRT_ColumnDef<any>[] = [
    {
        accessorKey: 'date',
        header: 'Data',
        size: 50,
    },
    {
        accessorKey: 'receiver',
        header: 'Beneficiar',
        size: 120,
    },
    {
        accessorKey: 'amount',
        header: 'Suma',
        size: 50,
    },
];

const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});

export default function Table({ data }: { data: any[] }) {
    const handleExportRows = (rows: MRT_Row<any>[]) => {
        const rowData = rows.map((row) => row.original);
        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
    };

    const handleExportData = () => {
        const csv = generateCsv(csvConfig)(data);
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
                    //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                    onClick={handleExportData}
                    leftIcon={<IconDownload />}
                    variant="filled"
                >
                    Export All Data
                </Button>
                <Button
                    disabled={table.getPrePaginationRowModel().rows.length === 0}
                    //export all rows, including from the next page, (still respects filtering and sorting)
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
                    //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
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
                    //only export selected rows
                    onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                    leftIcon={<IconDownload />}
                    variant="filled"
                >
                    Export Selected Rows
                </Button>
            </Box>
        ),
    });

    return <MantineReactTable table={table} />;
};
