import { List, ListItem, ListItemText, ListItemIcon, Checkbox, Divider, TextField, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Icon } from '@material-ui/core'
import React, { Fragment, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { IAppState } from '../models/appState'
import { IProjectInfo } from '../models/projectInfo'
import { projectsAction } from '../redux/reducers/projects'
import { getChildOfType } from '../utils/getChildOfType'
import PackagerForm from './PackagerForm'
import classes from '*.module.css'
import { useDebouncedState } from '../hooks/useDebouncedState'

interface Props {
  children?:JSX.Element
}

const ProjectList = (props: Props) => {
  const [search, setSearch] = useState('');
  const [dSearch, setdSearch ] = useDebouncedState(search, val => setSearch(val));
  const reg = new RegExp(search,'i');


  const projects = useSelector<IAppState, IProjectInfo[]>(state => state?.settings?.projects || [])
  const dispatch = useDispatch();
  const handleCheckboxChange = (proj:IProjectInfo, i:number, checked:boolean) => {
    const updated = {...proj, checked};
    dispatch(projectsAction({
      data: updated,
      index: i
    }))
  };
  const projectsListItem = projects.map((x,i) => {
    const matchesSearch = reg.test(`${x.name} ${x.path}`);
    return matchesSearch && (
      <Fragment key={x.name+'.checkforpublish'}>
        <ListItem>
          <ListItemIcon>
            <Checkbox
              onChange={(_e,checked) => handleCheckboxChange(x,i,checked)}
              value={x.checkedForPublish}
              edge="start"
              tabIndex={-1}
            />
          </ListItemIcon>
          <ListItemText primary={x.name}
            secondary={x.path}
            >
          </ListItemText>
        </ListItem>
        <Divider/>
      </Fragment>
    )
  });
  return (
    <Fragment>
      <div>
        <List component="nav" aria-label="main mailbox folders">
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
          {projectsListItem}
        </List>
      </div>
      <br/>
      {getChildOfType(props.children, PackagerForm)}
    </Fragment>
  )
}

export default ProjectList
