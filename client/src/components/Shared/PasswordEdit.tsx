import React from 'react';
import { TextField } from '@material-ui/core';
import { EditComponentProps } from 'material-table';

const PasswordEdit = (props: EditComponentProps<any>) => {
  return (
    <TextField
      onChange={(e) => props.onChange(e.target.value)}
      value={props.value || ''}
      type="password"
    />
  );
};

export default PasswordEdit;
