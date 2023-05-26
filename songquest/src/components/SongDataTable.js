import React from 'react';
import { connect } from 'react-redux';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import MaterialReactTable from 'material-react-table';
import { IconButton, Tooltip, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { searchSongRequest } from '../thunks';
import SongForm from './SongForm';

const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
};

const Table = ({ songData }) => {
  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'song',
        header: 'Song',
      },
      {
        accessorKey: 'performer',
        header: 'Performer',
      },
      {
        accessorKey: 'writers',
        header: 'Writers',
      },
      {
        accessorKey: 'publisher',
        header: 'Publisher',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
    ],
    []
  );

  const dataRows = React.useMemo(() => {
    if (!songData) {
        return [];
    }

    const ascapResults = songData.ascap_results || {};
    const bmiResults = songData.bmi_results || {};

    if (isEmptyObject(ascapResults) && isEmptyObject(bmiResults)) {
        return []
    };
    

    const formatResults = (arr) => {
    const flattenedArray = arr.flat();
    const lastIndex = flattenedArray.length - 1;

    return flattenedArray.map((item, index) => (
        <div>
        {item}
        {index !== lastIndex && <>,<br /></>}
        </div>
    ));
    };


    const ascapDataRows = ascapResults.title.map((title, index) => ({
        song: title,
        performer: formatResults(ascapResults.performers[index]),
        writers: formatResults(ascapResults.writers[index]),
        publisher: formatResults(ascapResults.publishers[index]),
        address: formatResults(ascapResults.publishers_address[index]),
        phoneNumber: formatResults(ascapResults.publishers_phone_number[index]),
        email: formatResults(ascapResults.publishers_email[index]),
    }));

    const bmiDataRows = bmiResults.title.map((title, index) => ({
        song: title,
        performer: formatResults(bmiResults.performers[index]),
        writers: formatResults(bmiResults.writers[index]),
        publisher: formatResults(bmiResults.publishers[index]),
        address: formatResults(bmiResults.publishers_address[index]),
        phoneNumber: formatResults(bmiResults.publishers_phone_number[index]),
        email: formatResults(bmiResults.publishers_email[index]),
    }));

    return [...ascapDataRows, ...bmiDataRows];
    }, [songData]);


  return (
    <MaterialReactTable
      columns={columns}
      data={dataRows}
      initialState={{ showColumnFilters: true }}
      manualFiltering
      manualPagination
      manualSorting
      renderTopToolbarCustomActions={() => (
        <Tooltip arrow title="Refresh Data">
          <IconButton onClick={() => {}}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      )}
    />
  );
};

const SongDataTable = ({ onSearchPressed, onDataLoaded, songData, query }) => {
  const queryClient = new QueryClient();
  console.log(songData)
  const showTable = !isEmptyObject(songData.ascap_results) || !isEmptyObject(songData.bmi_results)

  return (
    <QueryClientProvider client={queryClient}>
      {songData ? (
      <SongForm onSearchPressed={onSearchPressed} onDataLoaded={onDataLoaded} query={query} />
      ) : (
        <Table songData={songData}/>
      )}
    </QueryClientProvider>
  );
};

const mapStateToProps = (state) => {
  return {
    query: state.song.query || {},
    songData: state.song.songData || {},
  };
};

export default connect(mapStateToProps)(SongDataTable);
