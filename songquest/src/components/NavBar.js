import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Slide,
  Toolbar,
  Typography,
  useScrollTrigger,
} from '@mui/material';
import { resetDataLoaded } from '../actions';
import { connect } from 'react-redux';

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
  const navigate = useNavigate();

  const handleNavigateToSongForm = () => {
    resetDataLoaded();
    navigate('/', { replace: true });
  };

  return (
    <>
      <HideOnScroll>
        <AppBar color="secondary">
          <Toolbar>
            <Link
              to="/"
              style={{ textDecoration: 'none', color: 'inherit' }}
              onClick={handleNavigateToSongForm}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, textAlign: 'left' }}
              >
                SongQuest
              </Typography>
            </Link>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </>
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
