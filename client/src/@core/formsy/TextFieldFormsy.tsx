import React, { ChangeEvent } from 'react';
import { TextField, TextFieldProps } from '@material-ui/core';
import { withFormsy } from 'formsy-react';
import _ from '@lodash';

type Props = TextFieldProps & {
  errorMessage: string;
  setValue: Function;
};
function TextFieldFormsy(props: Props) {
  const importedProps = _.pick(props, [
    'autoComplete',
    'autoFocus',
    'children',
    'className',
    'defaultValue',
    'disabled',
    'FormHelperTextProps',
    'fullWidth',
    'id',
    'InputLabelProps',
    'inputProps',
    'InputProps',
    'inputRef',
    'label',
    'multiline',
    'name',
    'onBlur',
    'onChange',
    'onFocus',
    'placeholder',
    'required',
    'rows',
    'rowsMax',
    'select',
    'SelectProps',
    'type',
    'variant',
  ]);

  const errorMessage = props.errorMessage;
  const value = props.value || '';

  function changeValue(event: ChangeEvent<any>) {
    props.setValue(event.currentTarget.value);
    if (props.onChange) {
      props.onChange(event);
    }
  }

  return (
    <TextField
      {...importedProps}
      onChange={changeValue}
      value={value}
      error={Boolean(errorMessage)}
      helperText={errorMessage}
    />
  );
}

export default React.memo(withFormsy<any, any>(TextFieldFormsy));
