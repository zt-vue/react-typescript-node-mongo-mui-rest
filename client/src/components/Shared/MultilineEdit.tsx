import React from 'react';
import { TextField } from '@material-ui/core';
import { EditComponentProps } from 'material-table';

const MultilineEdit = (props: EditComponentProps<any>) => {
  return (
    <TextField
      onChange={(e) => props.onChange(e.target.value)}
      value={props.value}
      multiline
      rows="3"
    />
  );
};
export default MultilineEdit;
