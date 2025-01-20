import { useContext, useEffect, useMemo, useState } from 'react';
import {
  MantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import { ReviewsServices } from '@/services/reviews/reviewsServices';
import { ProfileContext } from '@/contexts/ProfileContext';

type Trail = {
  trail_name: string;
  text: string;
};

const ReviewsTable = () => {
  const columns = useMemo<MRT_ColumnDef<Trail>[]>(
    () => [
      {
        accessorKey: 'trail_name',
        header: 'Numele Traseului',
      },
      {
        accessorKey: 'text',
        header: 'Review',
          },
      {
        accessorKey: 'is_favorited',
        header: 'Traseu Favorit',
      },
    ],
    [],
  );

  const profile = useContext(ProfileContext);
  const [data, setData] = useState<Trail[]>([]);

  useEffect(() => {
    if (profile?.profile?.email) {
      ReviewsServices.getAllReviewsForUser(profile.profile.email).then(
        (response: any) => {
          if (response && response?.data) {
            setData(response.data.reviews || []);
          }
        },
      );
    }
  }, [profile?.profile?.email]);

  return (
    <MantineReactTable
      columns={columns}
      data={data}
      enablePagination
      initialState={{
        pagination: { pageIndex: 0, pageSize: 5 }, // 5 rows per page
      }}
    />
  );
};

export default ReviewsTable;
