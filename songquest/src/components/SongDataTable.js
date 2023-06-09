import React from 'react';
import { connect } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MaterialReactTable from 'material-react-table';
import { IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
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
        header: 'Publisher Address',
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Publisher Phone Number',
      },
      {
        accessorKey: 'email',
        header: 'Publisher Email',
      },
      {
        accessorKey: 'copyrights',
        header: 'Copyrights',
      },
      {
        accessorKey: 'label',
        header: 'Label',
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
      return [];
    }

    const formatPublishingResults = (arr) => {
      const flattenedArray = arr.flat();
      const lastIndex = flattenedArray.length - 1;

      return flattenedArray.map((item, index) => (
        <div>
          {item}
          {index !== lastIndex && (
            <>
              ,<br />
            </>
          )}
        </div>
      ));
    };

    const ascapDataRows = !isEmptyObject(ascapResults)
      ? ascapResults.title?.map((title, index) => ({
          song: title,
          performer: formatPublishingResults(ascapResults.performers[index]),
          writers: formatPublishingResults(ascapResults.writers[index]),
          publisher: formatPublishingResults(ascapResults.publishers[index]),
          address: formatPublishingResults(
            ascapResults.publishers_address[index]
          ),
          phoneNumber: formatPublishingResults(
            ascapResults.publishers_phone_number[index]
          ),
          email: formatPublishingResults(ascapResults.publishers_email[index]),
          copyrights: ascapResults.copyrights && ascapResults.copyrights.flat(),
          label: ascapResults.label && ascapResults.label.flat(),
          source: 'ASCAP',
        }))
      : [];

    const bmiDataRows = !isEmptyObject(bmiResults)
      ? bmiResults.title?.map((title, index) => ({
          song: title,
          performer: formatPublishingResults(bmiResults.performers[index]),
          writers: formatPublishingResults(bmiResults.writers[index]),
          publisher: formatPublishingResults(bmiResults.publishers[index]),
          address: formatPublishingResults(
            bmiResults.publishers_address[index]
          ),
          phoneNumber: formatPublishingResults(
            bmiResults.publishers_phone_number[index]
          ),
          email: formatPublishingResults(bmiResults.publishers_email[index]),
          copyrights: bmiResults.copyrights && bmiResults.copyrights.flat(),
          label: bmiResults.label && bmiResults.label.flat(),
          source: 'BMI,',
        }))
      : [];

    // const combinedDataRows = [...ascapDataRows, ...bmiDataRows];

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

const SongDataTable = ({ onSearchPressed, onDataLoaded, query, songData }) => {
  const queryClient = new QueryClient();
  const showTable = !isEmptyObject(songData);

  return (
    <QueryClientProvider client={queryClient}>
      {showTable ? (
        <Table songData={songData} />
      ) : (
        <SongForm
          onSearchPressed={onSearchPressed}
          onDataLoaded={onDataLoaded}
          query={query}
        />
      )}
    </QueryClientProvider>
  );
};

const mapStateToProps = (state) => {
  return {
    query: state.song.query || {},
    songData: state.song.songData || {},
    dataLoaded: state.song.dataLoaded || {},
  };
};

export default connect(mapStateToProps)(SongDataTable);
