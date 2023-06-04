import React, { useEffect, useState } from 'react';
import SongForm from './components/SongForm';
import SongDataTable from './components/SongDataTable';
import { searchSongRequest } from './thunks';
import { connect } from 'react-redux';
import { searchSongSuccess } from './actions';
import { Route, Routes, useNavigate } from 'react-router-dom';

const RoutesContainer = ({ query, dataLoaded, error, onSearchPressed }) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onDataLoaded = () => {
        setIsLoading(false)
    };

    useEffect(() => {
      if (dataLoaded && !error) {
        navigate(getDataTableRoutePath(query)); // Navigate to SongDataTable route programmatically
      }
    }, [dataLoaded, error, query, navigate]);

    const getDataTableRoutePath = (query) => {
      const { song, performer } = query;
      let path = '/song-data';

      const searchParams = new URLSearchParams();
      if (song) {
        searchParams.set('song', song);
      }
      if (performer) {
        searchParams.set('performer', performer);
      }

      const search = searchParams.toString();
      if (search) {
        path += `?${search}`;
      }

      return path;
    };

    return (
      <Routes>
          <Route 
            exact 
            path={"/" }
            element={<SongForm onSearchPressed={onSearchPressed} onDataLoaded={onDataLoaded} />} 
          />
          <Route 
            exact
            path={"/song-data"} 
            element={
              <SongDataTable 
                  query={query} 
                  onSearchPressed={onSearchPressed} 
                  onDataLoaded={onDataLoaded} 
                  dataLoaded={dataLoaded}
              />
          } 
          />
      </Routes>
    )
};

const mapStateToProps = (state) => {
  return {
    query: state.song.query || {},
    dataLoaded: state.song.dataLoaded || false,
    error: state.song.error
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSearchPressed: (query) => {
      dispatch(searchSongRequest(query));
    },
    onDataLoaded: (songData, query) => {
      dispatch(searchSongSuccess(songData, query));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RoutesContainer);
