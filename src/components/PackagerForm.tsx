import { Button, Icon } from '@material-ui/core';
import React, { useRef } from 'react';
import { PublishSetupDialogRef, PublishSetupDialog } from './PublishSetupDialog';
import { projectStateSlicer } from '../redux/reducers/projectStateSlicer';
import { useDispatch, useSelector } from 'react-redux';
import { IAppState } from '../models/appState';
import { IDictionary } from '../models/dictionary';
import { IProjectStatus } from '../models/projectStatus';


interface Props {

}

const rootStyle:React.CSSProperties = {
  textAlign: 'right'
}

const PackagerForm = (props: Props) => {
  const hasPublish = useSelector<IAppState,boolean>(({ projectState }) => {
    return Object.keys(projectState || {}).some((key) => projectState[key].checkForPublish)
  });
  const dialogRef = useRef<PublishSetupDialogRef>();
  const dispatch = useDispatch();
  const startPublish = async () => {
    if(!dialogRef.current){
      return;
    }

    const willPublish =  await dialogRef.current.show();
    if(!willPublish){
      dispatch(projectStateSlicer.actions.unCheckPublishValuesAll());
    }
  }
  return (
    <div className="PackagerForm" style={rootStyle}>
      <Button variant="contained" 
        disabled={!hasPublish}
        onClick={startPublish}
        startIcon={<Icon className="fas fa-upload"/>}
        size="large" 
        color="primary"
        >
        Publish
      </Button>
      <PublishSetupDialog ref={dialogRef}/>
    </div>
  )
}

export default PackagerForm