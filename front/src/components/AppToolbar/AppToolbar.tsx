import React from 'react';
import { AppBar, styled, Toolbar, Typography } from '@mui/material';
import { Link as NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import AnonymousMenu from './AnonymousMenu';
import UserMenu from './UserMenu';

const Link = styled(NavLink)({
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': {
    color: 'inherit',
  }
});

const AppToolbar = () => {
  const {user} = useSelector((state:RootState) => state.users)
  return (
    <AppBar sx={{mb: 2}} className="toolbar">
      <Toolbar>
        <Typography variant="h4" component="div" sx={{flexGrow: 1}}>
          <Link to="/">Chat</Link>
        </Typography>
        {user ? <UserMenu user={user}/> : <AnonymousMenu/>}
      </Toolbar>
    </AppBar>
  );
};

export default AppToolbar;