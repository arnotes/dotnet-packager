import React, { Fragment } from 'react';
import { useDebouncedState } from '../hooks/useDebouncedState';

interface Props<T> {
  state: T;
  onStateChange: (state: T) => void;
  children: (state: T, setState: (val: T) => void) => JSX.Element|JSX.Element[];
}

export default function StateDebouncer<T>({ state, children, onStateChange }: Props<T>) {
  const [dState, setDState] = useDebouncedState(state, onStateChange);
  return (
    <Fragment>
      {children(dState, setDState)}
    </Fragment>
  )
}