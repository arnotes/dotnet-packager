import { Button, Icon } from '@material-ui/core';
import React, { useRef } from 'react';
import { PublishSetupDialogRef, PublishSetupDialog } from './PublishSetupDialog';
import { projectStateSlicer } from '../redux/reducers/projectStateSlicer';


interface Props {

}

const rootStyle:React.CSSProperties = {
  textAlign: 'right'
}

const PackagerForm = (props: Props) => {
  const dialogRef = useRef<PublishSetupDialogRef>();
  const startPublish = async () => {
    if(!dialogRef.current){
      return;
    }

    const willPublish =  await dialogRef.current.show();
    if(!willPublish){
      projectStateSlicer.actions.unCheckPublishValuesAll();
    }
  }
  return (
    <div className="PackagerForm" style={rootStyle}>
      <Button variant="contained" 
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