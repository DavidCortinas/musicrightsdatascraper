import React, { useState } from 'react';
import { Container } from '@material-ui/core';
import { HideAppBar } from './components/HideAppBar';
import SongForm from './components/SongForm';
import SongDataTable from './components/SongDataTable';

const AppContainer = () => {
    const [query, setQuery] = useState({ song: '', performer: '' });
    const [dataLoaded, setDataLoaded] = useState(false);

    const handleSearchPressed = (query) => {
        setQuery(query);
    };

    const handleDataLoaded = () => {
        setDataLoaded(true);
    };

    return (
        <Container maxWidth='xl'>
            <HideAppBar />
            <br />
            {dataLoaded ? (
                <SongDataTable query={query} onSearchPressed={handleSearchPressed} onDataLoaded={handleDataLoaded}/>
            ) : (
                <SongForm onSearchPressed={handleSearchPressed} onDataLoaded={handleDataLoaded} />
    )}
        </Container>
    );
};

export default AppContainer