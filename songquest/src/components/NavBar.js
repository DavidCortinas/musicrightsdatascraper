import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { AppBar, CardHeader, CssBaseline, FormControlLabel, FormGroup, Grid, IconButton, Slide, Switch, Toolbar, Typography, createTheme, styled, ThemeProvider, useScrollTrigger } from '@mui/material';
import { resetDataLoaded } from '../actions';
import { connect } from 'react-redux';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fafafa',
  color: theme.palette.mode === 'dark' ? theme.palette.text.primary : "#6573c3",
}));

const StyledToolbar = styled(Toolbar)({
  justifyContent: 'space-between',
})

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export const NavBar = ({ resetDataLoaded }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const theme = createTheme({
    palette: {
      mode: isDarkTheme ? 'dark' : 'light',
    },
  });

  const navigate = useNavigate();

  const handleNavigateToSongForm = () => {
    resetDataLoaded();
    navigate('/', {replace: true })
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HideOnScroll>
        <StyledAppBar>
          <StyledToolbar>
            {/* <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
              sx={{ mr: 2 }}
            > */}
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleNavigateToSongForm}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
                  SongQuest
                </Typography>
              </Link>
              <div>
                {/* <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                </Menu> */}
              </div>
            {/* </IconButton> */}
            <CardHeader 
              action={
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch checked={isDarkTheme} onChange={changeTheme} />
                    }
                    label="Dark Theme"
                  />
                </FormGroup>
              }
            />
          </StyledToolbar>
        </StyledAppBar>
      </HideOnScroll>
      <Toolbar />
    </ThemeProvider>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetDataLoaded: () => {
      dispatch(resetDataLoaded());
    },
  };
};

export default connect(null, mapDispatchToProps)(NavBar);
