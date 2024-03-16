import Login from './features/users/Login/Login.tsx';
import {Container, Grid} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import {Route, Routes} from 'react-router-dom';
import Register from './features/users/Register/Register.tsx';
import AppToolbar from './components/AppToolbar/AppToolbar.tsx';
import Chat from './features/Chat/Chat.tsx';

function App() {

  return (
    <>
      <Grid>
        <CssBaseline/>

        <header style={{marginBottom: '70px'}}>
          <AppToolbar/>
        </header>

        <main>
          <Container maxWidth="xl">
            <Routes>
              <Route path="/" element={<Chat/>}/>
              <Route path="/register" element={<Register/>}/>
              <Route path="/login" element={<Login/>}/>
            </Routes>
          </Container>
        </main>
      </Grid>

    </>
  );
}

export default App;
