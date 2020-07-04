import { Button, Icon } from '@material-ui/core';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { usePublishInfo } from '../hooks/usePublishInfo';
import { projectStateSlicer } from '../redux/reducers/projectStateSlicer';
import { nuget } from '../services/nuget';
import { PublishSetupDialog, PublishSetupDialogRef } from './PublishSetupDialog';


interface Props {

}

const rootStyle:React.CSSProperties = {
  textAlign: 'right'
}

const PackagerForm = (props: Props) => {
  const [projState, projInfos, hasPublish] = usePublishInfo();
  const stateRef = useRef(projState);
  stateRef.current = projState;
  const dialogRef = useRef<PublishSetupDialogRef>();
  const dispatch = useDispatch();
  const startPublish = async () => {
    if(!dialogRef.current){
      return;
    }

    const willPublish =  await dialogRef.current.show();
    if(!willPublish){
      //dispatch(projectStateSlicer.actions.unCheckPublishValuesAll());
    }else{
      const toPublish = projInfos.filter(x => stateRef.current[x.name]?.checkForPublish);
      nuget.beginPublish(stateRef.current, toPublish, projInfos);
    }
    dispatch(projectStateSlicer.actions.unCheckPublishValuesAll());
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