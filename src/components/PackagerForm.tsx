import { Button, Icon } from '@material-ui/core';
import React from 'react';

interface Props {

}

const rootStyle:React.CSSProperties = {
  textAlign: 'right'
}

const PackagerForm = (props: Props) => {
  return (
    <div className="PackagerForm" style={rootStyle}>
      <Button variant="contained" 
        startIcon={<Icon className="fas fa-upload"/>}
        size="large" 
        color="primary"
        >
        Publish
      </Button>
    </div>
  )
}

export default PackagerForm