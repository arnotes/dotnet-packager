import { Checkbox, Divider, List, ListItem, ListItemIcon, ListItemText, Badge, BadgeOrigin } from '@material-ui/core'
import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IAppState } from '../models/appState'
import { IDictionary } from '../models/dictionary'
import { IProjectInfo } from '../models/projectInfo'
import { IProjectStatus } from '../models/projectStatus'
import { projectStateSlicer } from '../redux/reducers/projectStateSlicer'
import { getChildOfType } from '../utils/getChildOfType'
import PackagerForm from './PackagerForm'
import SearchBar from './SearchBar'

interface Props {
  children?: JSX.Element | JSX.Element[]
}
const projBadgeOrigin:BadgeOrigin = {
  horizontal: 'right',
  vertical: 'top'
}
const ProjectList = (props: Props) => {
  const search = useSelector<IAppState, string>(state => state.search ?? '');
  const projects = useSelector<IAppState, IProjectInfo[]>(
    state => state?.settings?.projects ?? [],
    (left, right) => (left?.length ?? 0) === (right?.length ?? 0)
  )
  const projectState = useSelector<IAppState, IDictionary<IProjectStatus>>(state => state.projectState ?? {});
  const reg = new RegExp(search, 'i');
  const dispatch = useDispatch();

  const handleCheckboxChange = (proj: IProjectInfo, i: number, checked: boolean) => {
    dispatch(projectStateSlicer.actions.setCheckForPublish({
      name: proj.name,
      checked
    }));
  };

  const projectsListItem = projects.map((x, i) => {
    const matchesSearch = reg.test(`${x.name} ${x.path}`);
    return matchesSearch && (
      <Fragment key={x.name + '.checkforpublish'}>
        <ListItem>
          <ListItemIcon>
            <Checkbox
              color="primary"
              onChange={(_e,checked) => handleCheckboxChange(x, i, checked)}
              checked={projectState[x.name]?.checkForPublish ?? false}
              edge="start"
              tabIndex={-1}
            />
          </ListItemIcon>
          <ListItemText primary={x.name}
            secondary={
              <Badge className="proj-badge" 
                anchorOrigin={projBadgeOrigin}
                color="secondary"
                badgeContent={'L'+x.level.toString()}>
                {x.path}&nbsp;&nbsp;
              </Badge>              
            }
            >
          </ListItemText>
        </ListItem>
        <Divider />
      </Fragment>
    )
  });
  return (
    <Fragment>
      <div>
        <List component="nav" aria-label="main mailbox folders">
          {getChildOfType(props.children, SearchBar)}
          {projectsListItem}
        </List>
      </div>
      <br />
      {getChildOfType(props.children, PackagerForm)}
    </Fragment>
  )
}

export default ProjectList
