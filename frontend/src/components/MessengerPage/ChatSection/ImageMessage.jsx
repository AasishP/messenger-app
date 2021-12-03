import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles';
import React from 'react'

const useStyles=makeStyles({
    imagesContainer:{
        display: "flex",
        flexWrap:"wrap",
        maxWidth:"60%"
    },
    image:{
        height: "200px",
        width: "200px",
        objectFit:"cover",
    }
})

function ImageMessage({images}) {
    const classes=useStyles();
    return (
        <Box className={classes.imagesContainer}>
            {images.map(imageObj=>{
                return <image src={imageObj} className={classes.image} />
            })}
        </Box>
    )
}

export default ImageMessage
