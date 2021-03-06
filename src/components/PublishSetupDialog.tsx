import { List, ListItem, TextField, ListItemSecondaryAction, IconButton, Icon } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { forwardRef, useImperativeHandle, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IAppState } from '../models/appState';
import { IDictionary } from '../models/dictionary';
import { IProjectInfo } from '../models/projectInfo';
import { IProjectStatus } from '../models/projectStatus';
import { nuget } from '../services/nuget';
import { projectStateSlicer } from '../redux/reducers/projectStateSlicer';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import StateDebouncer from './StateDebouncer';

interface Props{

}

interface ProjectsAndState{
  projects:IProjectInfo[];
  projectState:IDictionary<IProjectStatus>;
}

export interface PublishSetupDialogRef{
  show: () => Promise<boolean>;
}

function _PublishSetupDialog(props:Props, ref:any) {
  const sbjDialogReponse = useRef(new Subject<boolean>());
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const scroll = 'paper';
  const myState = useSelector<IAppState,ProjectsAndState>(
    state => {
      const projectState = state.projectState;
      const projects = state.settings.projects;
      return {
        projects,
        projectState,
      }
    },
    (a,b) => a.projects === b.projects && a.projectState === b.projectState
  );
  
  const handleClose = (willPublish:boolean) => {
    setOpen(false);
    sbjDialogReponse.current.next(willPublish);
  };

  const handleUnpublish = (proj:IProjectInfo) => {
    dispatch(projectStateSlicer.actions.setCheckForPublish({
      checked: false,
      name: proj.name
    }))
  }

  const handleVersionChange = (projName:string, version:string) => {
    dispatch(projectStateSlicer.actions.setProjectState({
      name: projName,
      status: {
        ...myState.projectState[projName],
        version
      }
    }))
  }

  useImperativeHandle(ref,() => ({
    show: () => {
      setOpen(true);
      const toPublish = myState.projects.filter(proj => myState.projectState[proj.name]?.checkForPublish);
      const checklist = nuget.getClimbingPublish(toPublish, myState.projects);

      dispatch(projectStateSlicer.actions.setCheckPublishValues(checklist));
      const fullPublishBatch = myState.projects.filter(proj => checklist[proj.name]);
      nuget.loadVersionsToState(fullPublishBatch, dispatch);
      return sbjDialogReponse.current.pipe(take(1)).toPromise();
    }
  }) as PublishSetupDialogRef)

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const projectList = !open? null : (
    myState.projects.map(proj => 
      myState.projectState[proj.name]?.checkForPublish && 
      <ListItem key={proj.name}>
        <StateDebouncer 
          onStateChange={(s)=>handleVersionChange(proj.name, s)}
          state={myState.projectState[proj.name]?.version ?? ''}>
          {(dState, setDState)=>(
            <TextField
              value={dState}
              onChange={(e)=>setDState(e.target.value)}
              label={proj.name}
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          )}
        </StateDebouncer>
        &nbsp;&nbsp;&nbsp;
        <ListItemSecondaryAction>
          <IconButton onClick={()=>handleUnpublish(proj)} edge="end" aria-label="delete">
            <Icon className="fas fa-times" />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )
  );

  return (
    <Dialog
      open={open}
      onClose={()=>handleClose(false)}
      scroll={scroll}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle>Set project verions</DialogTitle>
      <DialogContent dividers={scroll === 'paper'}>
        <List>
          {projectList}
        </List>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="default" onClick={()=>handleClose(false)}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={()=>handleClose(true)}>
          Publish
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export const PublishSetupDialog = forwardRef<PublishSetupDialogRef|undefined>(_PublishSetupDialog);