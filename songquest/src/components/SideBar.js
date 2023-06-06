import { useEffect, useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import WorkIcon from '@mui/icons-material/Work';
import { resetDataLoaded } from '../actions';

export const SideBar = ({ resetDataLoaded }) => {
    const viewHeight = window.outerHeight;
    const location = useLocation();
    const navigate = useNavigate();
    const [collapse, setCollapse] = useState(false);

    useEffect(() => {
        if (location.pathname !== '/') {
        navigate('/');
        }
    }, [location.pathname, navigate]);

    const handleHomeNavigation = (path) => {
        resetDataLoaded();
        navigate(path);
    };

    const handleCollapse = () => {
        collapse === false
        ? setCollapse(true)
        : setCollapse(false);
    };

    return (
        <Sidebar 
          style={{ height: viewHeight }} 
          collapsed={collapse} 
          backgroundColor='#001747'
          >
            <Menu>
                {/* <SubMenu label="Charts">
                <MenuItem> Pie charts </MenuItem>
                <MenuItem> Line charts </MenuItem>
                </SubMenu> */}
                <MenuItem
                  onClick={() => handleCollapse()}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                    <MenuOpenIcon 
                      style={{
                      transform: collapse ? 'scaleX(-1)' : 'scaleX(1)',
                      transition: 'transform 0.3s ease',
                      color: 'white'
                      }}
                    />
                </MenuItem>
                <MenuItem style={{ color: 'white' }} onClick={() => handleHomeNavigation('/')}>{collapse ? <HomeIcon style={{ color: 'white' }}/> : 'Home'}</MenuItem>
                <MenuItem disabled>{collapse ? <SavedSearchIcon /> : 'Saved Searches'}</MenuItem>
                <MenuItem disabled>{collapse ? <WorkIcon /> : 'Licensing Projects'}</MenuItem>
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