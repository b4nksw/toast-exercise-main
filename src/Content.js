import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import _ from 'lodash'

import {
  onMessage,
  fetchLikedFormSubmissions,
  saveLikedFormSubmission,
} from './service/mockServer';

export default function Content({
  openSnackBar,
  setOpenSnackBar,
}) {
  const [submission, setSubmission] = useState([]);

  const theme = createTheme({
    palette: {
      aquaBlue: {
        main: '#aee2eb',
      },
    },
  });

  const handleClose = () => {
    setOpenSnackBar(false);
  };

  const fetchSubmissions = () => {
    fetchLikedFormSubmissions().then((data) => {
      const { formSubmissions } = data;
      setSubmission(formSubmissions);
    });
  }

  useEffect(() => {
    // get submission when boot up
    fetchSubmissions()

    // add on message callback
    onMessage(
      (formSubmission) => saveLikedFormSubmission(formSubmission).then(
        (value) => {
          if (value.status === 202){
            console.log('Success saving submission')
            fetchSubmissions()
          }
        }
      )
    );
  }, []);

  const action = (
    <React.Fragment>
      <Button color="aquaBlue" size="small" onClick={handleClose}>
        LIKE
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h4">Liked Form Submissions</Typography>

        <Typography component='div' variant="body1" sx={{ fontStyle: 'italic', marginTop: 1 }}>
          {_.map(submission, ({data}, i) => {
            const { email, firstName, lastName } = data
            return <div key={i}> email: {email}, firstName: {firstName}, lastName: {lastName}</div>
          })}
        </Typography>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={openSnackBar}
          autoHideDuration={6000}
          onClose={handleClose}
          message="Message"
          action={action}
        />
      </Box>
    </ThemeProvider>
  );
}
