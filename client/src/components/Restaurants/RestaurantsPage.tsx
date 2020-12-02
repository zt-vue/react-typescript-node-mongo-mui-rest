import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, Restaurant as IRestaurant } from 'types';
import { Typography } from '@material-ui/core';
import MaterialTable, {
  EditCellColumnDef,
  Query,
  MTableToolbar,
} from 'material-table';
import axios from 'services/axiosService';
import RestaurantDetails from './RestaurantDetails';
import Rating from '@material-ui/lab/Rating';
import * as coreActions from 'store/actions/core';

type Restaurant = IRestaurant & EditCellColumnDef;

type RestaurantPaginatedQuery = {
  data: Restaurant[];
  page: number;
  totalCount: number;
};

const useStyles = makeStyles((theme: any) => ({
  root: {},
}));

function RegisterPage() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const [reviewDetails, setReviewDetails] = useState<any>({});

  const [pageSize, setPageSize] = useState(2);
  const [, setPage] = useState(0);
  const [filter, setFilter] = useState<number | null>(5);

  const user = useSelector(({ auth }: RootState) => auth.user);

  const tableRef = useRef<any>();

  const fetchData = async (query: Query<Restaurant>) => {
    const { data }: any = await axios.get(
      `/api/restaurants/?page=${query.page}&perPage=${query.pageSize}&filter=${filter}`
    );
    return {
      data: data.restaurants,
      page: data.page,
      totalCount: Number(data.totalCount),
    } as RestaurantPaginatedQuery;
  };

  useEffect(() => {
    tableRef.current.onQueryChange();
  }, [filter]);

  const handleRowAdd = async (newData: Restaurant) => {
    await axios.post('/api/restaurants/', {
      ...newData,
    });
    dispatch(
      coreActions.showMessage({ message: 'Add a new restaurant succeed.' })
    );
  };
  const handleRowUpdate = async (newData: Restaurant, oldData?: any) => {
    await axios.post(`/api/restaurants/${oldData._id}`, { ...newData });
    dispatch(
      coreActions.showMessage({ message: 'Update a restaurant succeed.' })
    );
  };
  const handleRowDelete = async (oldData: Restaurant) => {
    console.log(tableRef.current);
    await axios.delete(`/api/restaurants/${oldData._id}`);
    dispatch(
      coreActions.showMessage({ message: 'Delete a restaurant succeed.' })
    );
  };

  const handleReviewChange = (rest: Restaurant) => {
    tableRef.current?.onQueryChange();
    setReviewDetails(rest);
  };

  let customProps: any = {
    editable: {},
  };
  if (user.role === 'admin') {
    customProps = {
      editable: {
        onRowUpdate: handleRowUpdate,
        onRowDelete: handleRowDelete,
      },
    };
  } else if (user.role === 'owner') {
    customProps = {
      editable: {
        onRowAdd: handleRowAdd,
      },
    };
  }
  return (
    <div
      className={clsx(
        classes.root,
        'flex flex-col flex-auto flex-shrink-0 p-10 h-full'
      )}
    >
      <Typography variant="h4" className="mt-16 mb-32">
        Restaurants Page
      </Typography>
      <div className="flex flex-col w-full">
        <MaterialTable
          title="Restaurants List"
          tableRef={tableRef}
          columns={[
            {
              title: 'Name',
              field: 'name',
              validate: (rowData: any) =>
                String(rowData.name) === ''
                  ? {
                      isValid: false,
                      helperText: 'Name cannot be empty',
                    }
                  : true,
            },
            {
              title: 'Address',
              field: 'address',
              validate: (rowData: any) =>
                String(rowData.address) === ''
                  ? {
                      isValid: false,
                      helperText: 'Name cannot be empty',
                    }
                  : true,
            },
            {
              title: 'Owner',
              field: 'user.name',
              editable: 'never',
            },
            {
              title: 'Average Rating',
              field: 'avgRating',
              type: 'numeric',
              editable: 'never',
              render: (rowData: any) => (
                <Rating
                  name="avg-rating"
                  value={parseFloat(rowData.avgRating.toFixed(1))}
                  readOnly
                  precision={0.1}
                />
              ),
            },
          ]}
          components={{
            Toolbar: (props) => (
              <div>
                <MTableToolbar {...props} />
                <div className="flex ml-12">
                  <span style={{ lineHeight: '26px' }}>
                    Filter by Average Rating:
                  </span>
                  <Rating
                    name="filter-rating"
                    value={filter}
                    precision={0.1}
                    size="large"
                    className="ml-12"
                    onChange={(e, newVal) => setFilter(newVal)}
                  />
                </div>
              </div>
            ),
          }}
          data={fetchData}
          {...customProps}
          actions={[
            {
              icon: 'description',
              tooltip: 'Show detail',
              onClick: (event, rowData) => {
                setOpen(true);
                setReviewDetails(rowData);
              },
            },
          ]}
          options={{
            actionsColumnIndex: -1,
            search: false,
            pageSizeOptions: [2, 5, 10],
            pageSize,
            sorting: false,
          }}
          onChangeRowsPerPage={setPageSize}
          onChangePage={setPage}
        />
      </div>
      <RestaurantDetails
        open={open}
        handleClose={() => setOpen(false)}
        handleReply={() => {}}
        curRestaurant={reviewDetails}
        handleReviewChange={handleReviewChange}
      />
    </div>
  );
}

export default RegisterPage;
