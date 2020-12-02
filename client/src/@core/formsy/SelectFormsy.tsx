import React, { ChangeEvent } from 'react';
import {
  FormControl,
  FormHelperText,
  FilledInput,
  OutlinedInput,
  InputLabel,
  Input,
  Select,
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
  name: string;
  variant: any;
}

function SelectFormsy(props: Props) {
  const importedProps = _.pick(props, [
    'autoWidth',
    'children',
    'classes',
    'displayEmpty',
    'input',
    'inputProps',
    'MenuProps',
    'multiple',
    'native',
    'onChange',
    'onClose',
    'onOpen',
    'open',
    'renderValue',
    'SelectDisplayProps',
    'value',
    'variant',
  ]);

  // An error message is returned only if the component is invalid
  const errorMessage = props.errorMessage;
  const value = props.value;

  function input() {
    switch (importedProps.variant) {
      case 'outlined':
        return (
          <OutlinedInput labelWidth={props.label.length * 8} id={props.name} />
        );
      case 'filled':
        return <FilledInput id={props.name} />;
      default:
        return <Input id={props.name} />;
    }
  }

  function changeValue(event: ChangeEvent<any>) {
    props.setValue(event.target.value);
    if (props.onChange) {
      props.onChange(event);
    }
  }

  return (
    <FormControl
      error={Boolean(errorMessage)}
      className={props.className}
      variant={importedProps.variant}
    >
      {props.label && (
        <InputLabel htmlFor={props.name}>{props.label}</InputLabel>
      )}
      <Select
        {...importedProps}
        value={value}
        onChange={changeValue}
        input={input()}
      />
      {Boolean(errorMessage) && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );
}

export default React.memo(withFormsy<any, any>(SelectFormsy));
