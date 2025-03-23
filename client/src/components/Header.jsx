import { AppBar, Toolbar, Typography } from '@mui/material';

function Header(props) {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography sx={{ display: 'flex', justifyContent: 'center' }}>{props.title}</Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
