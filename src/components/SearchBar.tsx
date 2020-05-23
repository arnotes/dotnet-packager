import { FormControl, Icon, InputAdornment, InputLabel, ListItem, OutlinedInput } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebouncedState } from '../hooks/useDebouncedState';
import { IAppState } from '../models/appState';
import { searchSlice } from '../redux/reducers/searchSlice';

interface Props {
  
}

const SearchBar = (props: Props) => {
  const dispatch = useDispatch();
  const search = useSelector<IAppState, string>(state => state.search ?? '');
  const [dSearch, setdSearch ] = useDebouncedState(search, val => dispatch(searchSlice.actions.update(val)));
  return (
    <ListItem>
      <FormControl fullWidth  variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Search</InputLabel>
        <OutlinedInput
          type="search"
          value={dSearch}
          onChange={e => setdSearch(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <Icon className="fas fa-search"/>
            </InputAdornment>
          }
          labelWidth={70}
        />
      </FormControl>
    </ListItem>
  )
}

export default SearchBar
