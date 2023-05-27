import React, { useState } from 'react';
import { Container } from '@material-ui/core';
import { HideAppBar } from './components/HideAppBar';
import SongForm from './components/SongForm';
import SongDataTable from './components/SongDataTable';
import { searchSongRequest } from './thunks';
import { connect, useDispatch } from 'react-redux';
import { clearSearchSongError, searchSongSuccess } from './actions';
import { Alert, Snackbar, Typography } from '@mui/material';

const AppContainer = ({ dataLoaded, error }) => {
    const [query, setQuery] = useState({ song: '', performer: '' });
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const handleSnackbarClose = () => {
        dispatch(clearSearchSongError());
    }

    const onSearchPressed = (query) => {
        setQuery(query);
    };

    const onDataLoaded = () => {
        setIsLoading(false)
    };

    const dataLoadedSuccess = dataLoaded && !error

    return (
        <Container maxWidth='xl'>
            <HideAppBar />
            <br />
            {dataLoadedSuccess ? (
                <SongDataTable 
                    query={query} 
                    onSearchPressed={onSearchPressed} 
                    onDataLoaded={onDataLoaded} 
                    dataLoaded={dataLoaded}
                />
            ) : (
            <>
                <SongForm onSearchPressed={onSearchPressed} onDataLoaded={onDataLoaded} />
                {/* Snackbar for displaying errors */}
                <Snackbar 
                    open={!!error} 
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
                >
                    <Alert 
                        onClose={handleSnackbarClose} 
                        severity="error" 
                        elevation={6} 
                        variant="filled"
                    >
                        <Typography>
                            {"There were no results returned for your search, please make sure the song's spelling is correct and enter the performer for more accurate search results"}
                        </Typography>
                    </Alert>
                </Snackbar>        
            </>
    )}
        </Container>
    );
};

const mapStateToProps = (state) => {
  return {
    query: state.song.query || {},
    dataLoaded: state.song.dataLoaded || false,
    error: state.song.error // Add the error property
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
