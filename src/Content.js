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
  const [toastData, setToastData] = useState({})
  const [submissionStatus, setSubmissionStatus] = useState('PROCESSING');
  const [fetchSuccess, setFetchSuccess] = useState(true);
  const [submissionListText, setSubmissionListText] = useState('Fetching submission list. Please wait.')

  const theme = createTheme({
    palette: {
      processing: {
        main: '#f6b331',
      },
      success: {
        main: '#49d749',
      },
      fail: {
        main: '#e93535',
      }
    },
  });

  const handleClose = () => {
    setOpenSnackBar(false);
  };

  const fetchSubmissions = () => {
    retry(fetchLikedFormSubmissions, 3)
    .then((data) => {
      console.log('Success fetching submission')
      setFetchSuccess(true);
      const { formSubmissions } = data;
      setSubmission(formSubmissions);
      if (submission.length === 0) setSubmissionListText('No submission is found.')
    })
    .catch(
      (error) => {
        console.log('Failed to fetch submission:', error)
        setFetchSuccess(false)
        setSubmissionListText('Fail to fetch submission. Please retry.')
      }
    );
  }

  const retry = (fn, retries) => {
    return new Promise((resolve, reject) => {
      const attempt = (retryCount) => {
        fn()
        .then(resolve)
        .catch((error) => {
          console.log('Retry fn failed')
          if (retryCount === 0) {
            // reject if no more retry attempts
            console.log('No more retry attempts, throw error:', error)
            reject(error);
          } else {
            // retry if max retry count is not hit
            console.log(`retry attempt: ${retries - retryCount}`)
            attempt(retryCount - 1);
          }
        });
      };
      attempt(retries);
    });
  }

  useEffect(() => {
    // get submission when boot up
    fetchSubmissions()

    // add on message callback
    onMessage(
      (formSubmission) => {
        retry(() => saveLikedFormSubmission(formSubmission), 3)
        .then(
          (value) => {
            if (value.status === 202){
              console.log('Success saving submission')
              setSubmissionStatus('SUCCESS')
              fetchSubmissions()
            }
          }
        )
        .catch(
          (error) => {
            console.log('Failed to save submission:', error)
            setSubmissionStatus('FAIL')
          }
        )
        .finally(() => 
          setTimeout(() => {
            setOpenSnackBar(false)
            setTimeout(() => setSubmissionStatus('PROCESSING'), 500) // to make sure the snackbar is completely closed before updating status
          }, 1000)
        );
      }
    );

    // set toast display text when new form submission is created
    onMessage(
      (formSubmission) => {
        setToastData(formSubmission)
      }
    )
  }, []);

  const action = (
    <React.Fragment>
      <Button color={submissionStatus.toLowerCase()} size="small" onClick={handleClose}>
        {submissionStatus}
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
          { submission.length === 0 || !fetchSuccess ?
            <span>{submissionListText}</span> : 
            _.map(submission, ({data}, i) => {
              const { email, firstName, lastName } = data
              return <div key={i}><b>Email:</b> {email}, <b>First Name:</b> {firstName}, <b>Last Name:</b> {lastName}</div>
          })}
        </Typography>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={openSnackBar}
          autoHideDuration={10000}
          onClose={handleClose}
          message={
            <span>
              { toastData.data ? 
              (
                <>
                  {`${toastData?.data?.firstName} ${toastData?.data?.lastName}`}<br />
                  {toastData?.data?.email}
                </>
              ) : 
              'New submission received'
              }
            </span>
          }
          action={action}
        />
      </Box>
    </ThemeProvider>
  );
}
