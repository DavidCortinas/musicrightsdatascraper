import React, { useState } from 'react';
import { Container } from '@material-ui/core';
import { HideAppBar } from './components/HideAppBar';
import SongForm from './components/SongForm';
import SongDataTable from './components/SongDataTable';
import { searchSongRequest } from './thunks';
import { connect } from 'react-redux';
import { dataLoaded } from './actions';

const AppContainer = ({ onDataLoaded }) => {
    const [query, setQuery] = useState({ song: '', performer: '' });
    const [dataLoaded, setDataLoaded] = useState(false);

    const handleSearchPressed = (query) => {
        setQuery(query);
    };

    const handleDataLoaded = () => {
        setDataLoaded(true);
    };

    console.log(dataLoaded)

    return (
        <Container maxWidth='xl'>
            <HideAppBar />
            <br />
            {dataLoaded ? (
                <SongDataTable 
                    query={query} 
                    onSearchPressed={handleSearchPressed} 
                    onDataLoaded={handleDataLoaded} 
                    dataLoaded={dataLoaded}
                />
            ) : (
                <SongForm onSearchPressed={handleSearchPressed} onDataLoaded={handleDataLoaded} />
    )}
        </Container>
    );
};

const mapStateToProps = (state) => {
  return {
    query: state.song.query || {},
    dataLoaded: state.song.dataLoaded || false,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleSearchPressed: (query) => {
      // Dispatch the searchSongRequest action here
      dispatch(searchSongRequest(query));
    },
    onDataLoaded: () => {
      dispatch(dataLoaded());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
