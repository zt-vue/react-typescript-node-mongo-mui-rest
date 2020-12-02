import React from 'react';
import { EditComponentProps } from 'material-table';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const DatePickerEdit = (props: EditComponentProps<any>) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        format="MM/dd/yyyy"
        margin="normal"
        id="date-picker-inline"
        label="Visited Date"
        autoOk
        maxDate={new Date()}
        value={props.value}
        onChange={(date: Date | null) =>
          props.onChange(date?.toLocaleDateString())
        }
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
      />
    </MuiPickersUtilsProvider>
  );
};
export default DatePickerEdit;
