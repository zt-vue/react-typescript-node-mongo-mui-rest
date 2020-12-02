import React, { ChangeEvent } from 'react';
import {
  FormControl,
  FormHelperText,
  FormLabel,
  RadioGroup,
} from '@material-ui/core';
import { withFormsy } from 'formsy-react';
import _ from '@lodash';

interface Props {
  errorMessage: string;
  value: any;
  label: string;
  className: string;
  setValue: Function;
  onChange: Function;
  required: boolean;
}

function RadioGroupFormsy(props: Props) {
  const importedProps = _.pick(props, [
    'children',
    'name',
    'onBlur',
    'onChange',
    'onKeyDown',
    'variant',
  ]);

  // An error message is returned only if the component is invalid
  const errorMessage = props.errorMessage;
  const value = props.value;

  function changeValue(event: ChangeEvent<HTMLInputElement>, value: any) {
    props.setValue(value);
    if (props.onChange) {
      props.onChange(event);
    }
  }

  return (
    <FormControl error={Boolean(errorMessage)} className={props.className}>
      <FormControl
        component="fieldset"
        required={props.required}
        error={Boolean(errorMessage)}
      >
        {props.label && <FormLabel component="legend">{props.label}</FormLabel>}
        <RadioGroup {...importedProps} value={value} onChange={changeValue} />
        {Boolean(errorMessage) && (
          <FormHelperText>{errorMessage}</FormHelperText>
        )}
      </FormControl>
    </FormControl>
  );
}

export default React.memo(withFormsy(RadioGroupFormsy));
