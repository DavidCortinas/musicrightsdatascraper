import { makeStyles } from '@mui/styles';
import { useEffect } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetDataLoaded } from '../actions';

const useStyles = makeStyles((theme) => ({
    sidebar: {
        height: '100%',
        // display: 'flex',
    },
}))

export const SideBar = ({ resetDataLoaded }) => {
    const classes = useStyles();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname !== '/') {
        navigate('/');
        }
    }, [location.pathname, navigate]);

    const handleNavigation = (path) => {
        resetDataLoaded();
        navigate(path);
    };

    return (
        <Sidebar className={classes.sidebar} >
            <Menu>
                {/* <SubMenu label="Charts">
                <MenuItem> Pie charts </MenuItem>
                <MenuItem> Line charts </MenuItem>
                </SubMenu> */}
                <MenuItem> Collapse </MenuItem>
                <MenuItem onClick={() => handleNavigation('/')}> Home </MenuItem>
                <MenuItem> Saved Searches </MenuItem>
                <MenuItem> Licensing Projects </MenuItem>
            </Menu>
        </Sidebar>
    )
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetDataLoaded: () => {
      dispatch(resetDataLoaded());
    },
  };
};

export default connect(null, mapDispatchToProps)(SideBar);