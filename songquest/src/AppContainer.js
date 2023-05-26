import React, { useState } from 'react';
import { Container } from '@material-ui/core';
import { HideAppBar } from './components/HideAppBar';
import SongForm from './components/SongForm';
import SongDataTable from './components/SongDataTable';
import { searchSongRequest } from './thunks';
import { connect } from 'react-redux';
import { searchSongSuccess } from './actions';

const AppContainer = (dataLoaded) => {
    const [query, setQuery] = useState({ song: '', performer: '' });
    const [isLoading, setIsLoading] = useState(false);

    const onSearchPressed = (query) => {
        setQuery(query);
    };

    const onDataLoaded = () => {
        console.log('SET')
        setIsLoading(false)
    };

    // console.log(dataLoaded())
    console.log(dataLoaded.dataLoaded)
    console.log(isLoading)

    return (
        <Container maxWidth='xl'>
            <HideAppBar />
            <br />
            {dataLoaded.dataLoaded ? (
                <SongDataTable 
                    query={query} 
                    onSearchPressed={onSearchPressed} 
                    onDataLoaded={onDataLoaded} 
                    dataLoaded={dataLoaded}
                />
            ) : (
                <SongForm onSearchPressed={onSearchPressed} onDataLoaded={onDataLoaded} />
    )}
        </Container>
    );
};

const mapStateToProps = (state) => {
    console.log(state)
  return {
    query: state.song.query || {},
    dataLoaded: state.song.dataLoaded || false,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSearchPressed: (query) => {
      // Dispatch the searchSongRequest action here
      dispatch(searchSongRequest(query));
    },
    onDataLoaded: (songData, query) => {
      dispatch(searchSongSuccess(songData, query));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
