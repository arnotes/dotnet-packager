import { List, ListItem, ListItemText, ListItemIcon, Checkbox, Divider } from '@material-ui/core'
import React, { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { IAppState } from '../models/appState'
import { IProjectInfo } from '../models/projectInfo'
import { projectsAction } from '../redux/reducers/projects'

interface Props {
  
}

const ProjectList = (props: Props) => {
  const projects = useSelector<IAppState, IProjectInfo[]>(state => state?.settings?.projects || [])
  const dispatch = useDispatch();
  const handleCheckboxChange = (proj:IProjectInfo, i:number, checked:boolean) => {
    const updated = {...proj, checked};
    dispatch(projectsAction({
      data: updated,
      index: i
    }))
  };
  const projectsListItem = projects.map((x,i) => (
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
    <Divider hidden={i+1 === projects.length} />
    </Fragment>
  ));
  return (
    <div>
      <List component="nav" aria-label="main mailbox folders">
        {projectsListItem}
      </List>
    </div>
  )
}

export default ProjectList
