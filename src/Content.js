import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function Content({ 
  openSnackBar, 
  setOpenSnackBar
}) {

  const theme = createTheme({
    palette: {
      aquaBlue: {
        main: "#aee2eb",
      },
    },
  });

  const handleClose = () => {
    setOpenSnackBar(false);
  };

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
      <Box sx={{marginTop: 3}}>
        <Typography variant="h4">Liked Form Submissions</Typography>

        <Typography variant="body1" sx={{fontStyle: 'italic', marginTop: 1}}>
          TODO: List of liked submissions here (delete this line)
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
