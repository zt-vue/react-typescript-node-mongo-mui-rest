import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import MaterialTable from 'material-table';
import PasswordEdit from '../Shared/PasswordEdit';
import { User } from 'types';
import axios from 'services/axiosService';
import * as coreActions from 'store/actions/core';
import { useDispatch } from 'react-redux';

const isEmail = (str: string) => {
  return str.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i
  );
};

const useStyles = makeStyles((theme: any) => ({
  root: {},
}));

function RegisterPage() {
  const classes = useStyles();

  const dispatch = useDispatch();

  useEffect(() => {
    axios.get('/api/users/').then(({ data }) => {
      if (data.users) {
        setData(data.users);
      } else {
        console.log(data.error);
      }
    });
  }, []);

  const handleRowUpdate = async (newData: User, oldData?: any) => {
    try {
      await axios.post(`/api/users/${oldData._id}`, { ...newData });

      const dataUpdate = [...data];
      const index = oldData.tableData.id;
      dataUpdate[index] = newData;
      setData([...dataUpdate]);
      dispatch(coreActions.showMessage({ message: 'Update user succeed.' }));
    } catch ({ response }) {
      console.log(response.data);
      const { message } = response.data;
      dispatch(coreActions.showMessage({ message }));
    }
  };
  const handleRowDelete = async (oldData: any) => {
    await axios.delete(`/api/users/${oldData._id}`);
    const dataDelete = [...data];
    const index = oldData.tableData.id;
    dataDelete.splice(index, 1);
    setData([...dataDelete]);
    dispatch(coreActions.showMessage({ message: 'Delete user succeed.' }));
  };

  const [data, setData] = useState<User[]>([]);

  return (
    <div
      className={clsx(
        classes.root,
        'flex flex-col flex-auto flex-shrink-0 p-10 h-full'
      )}
    >
      <Typography variant="h4" className="mt-16 mb-32">
        Users Page
      </Typography>
      <div className="flex flex-col w-full">
        <MaterialTable
          title="Users List"
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
              title: 'Email',
              field: 'email',
              validate: (rowData: any) =>
                !isEmail(rowData.email)
                  ? {
                      isValid: false,
                      helperText: 'Please input a valid email',
                    }
                  : true,
            },
            {
              title: 'Role',
              field: 'role',
              lookup: { regular: 'Regular', owner: 'Owner', admin: 'Admin' },
            },
            {
              title: 'Password',
              field: 'password',
              render: () => '********',
              editComponent: PasswordEdit,
            },
          ]}
          data={data}
          editable={{
            onRowUpdate: handleRowUpdate,
            onRowDelete: handleRowDelete,
          }}
          options={{
            actionsColumnIndex: -1,
            search: false,
          }}
        />
      </div>
    </div>
  );
}

export default RegisterPage;
