import React, { ChangeEvent } from 'react';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
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
}

function CheckboxFormsy(props: Props) {
  const importedProps = _.pick(props, [
    'checkedIcon',
    'classes',
    'color',
    'disabled',
    'disableRipple',
    'icon',
    'id',
    'indeterminate',
    'indeterminateIcon',
    'inputProps',
    'inputRef',
    'onChange',
    'variant',
  ]);

  // An error message is returned only if the component is invalid
  const errorMessage = props.errorMessage;
  const value = props.value;

  function changeValue(event: ChangeEvent<HTMLInputElement>) {
    props.setValue(event.target.checked);
    if (props.onChange) {
      props.onChange(event);
    }
  }

  return (
    <FormControl error={Boolean(errorMessage)} className={props.className}>
      <FormControlLabel
        control={
          <Checkbox
            {...importedProps}
            checked={value}
            // type="input"
            onChange={changeValue}
          />
        }
        label={props.label}
      />
      {Boolean(errorMessage) && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );
}

export default React.memo(withFormsy<any, any>(CheckboxFormsy));
