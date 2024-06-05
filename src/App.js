import React from 'react';
import Container from '@mui/material/Container';

import Header from './Header';
import Content from './Content';

function App() {
  const [openSnackBar, setOpenSnackBar] = React.useState(false);

  return (
    <>
      <Header 
        setOpenSnackBar={setOpenSnackBar}
      />
      <Container>
        <Content 
          openSnackBar={openSnackBar}
          setOpenSnackBar={setOpenSnackBar}
        />
      </Container>
    </>
  );
}

export default App;
