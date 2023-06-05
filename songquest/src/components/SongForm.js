import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Alert, Box, Button, Card, CardHeader, CircularProgress, FormControl, Grid, Snackbar, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { makeStyles } from '@mui/styles';
import { searchSongRequest } from '../thunks'
import { clearSearchSongError, searchSongSuccess } from "../actions";

const useStyles = makeStyles(theme => ({
    card: {
        width: "50rem",
    },
    textField: {
        width: "25rem",
        shrink: true,
    }, 
    subHeader: {
        width: "25rem"
    },
    description: {
        maxWidth: '65rem',
        color: "#6f6f71",
        paddingTop: "1rem"
    },
    descriptionBox: {
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: '1rem',
    }
}))

export const SongForm = ({ error, onSearchPressed, onDataLoaded, query }) => {
  const { handleSubmit } = useForm();
  const [songValue, setSongValue] = useState('');
  const [performerValue, setPerformerValue] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');

  const [invalidSearch, setInvalidSearch] = useState(false);

  const dispatch = useDispatch()

const handleSnackbarClose = () => {
    dispatch(clearSearchSongError());
}

  const onSubmit = async () => {
    if (songValue === '') {
      // Empty song value, set invalidSearch to true and exit the onSubmit process
      setInvalidSearch(true);
      return;
    }
    setIsLoading(true);

    const newQuery = {
        song: songValue,
        performer: performerValue,
    };
    try {
        const songData = await onSearchPressed(newQuery);
        onDataLoaded(songData, newQuery);
        setIsLoading(false);
    } catch (error) {
        console.log('Error: ', error);
        setIsLoading(false);
    }
  };

    const handleSongChange = (e) => {
        setInvalidSearch(false)
        setSongValue(e.target.value)
    }
    const handlePerformerChange = (e) => setPerformerValue(e.target.value)
    const handleReset = () => {
            setInvalidSearch(false)
            setSongValue("");
            setPerformerValue("")
        }

    const handleFormSubmit = (e) => {
        e.preventDefault(); // Prevent form submission
        onSubmit(); // Call the onSubmit function manually
    };

  const classes = useStyles();

  return isLoading && !invalidSearch ? (
    <>
        <Box display='flex' justifyContent='center' alignItems='center' height='30vh'>
            <CardHeader 
                title='Loading Results' 
                subheader='Be sure to include the name of the artist who performs the song for the quickest and most accurate search result...'
            />
        </Box>
        <Box display='flex' justifyContent='center' alignItems='center'>
            <CircularProgress />
        </Box>
    </>
    ) : (
        <>
        <Box className={classes.descriptionBox}>
            <Typography className={classes.description} variant="h6">
                Interested in licensing a song but don't know where to start? 
                Let SongQuest find the rights holders for you so you can focus on making the deal.
                Search for the song that you want to license below.
            </Typography>
        </Box>
        <Grid container justifyContent="center">
            <Card className={classes.card}>
                <form onSubmit={handleFormSubmit}>
                    <FormControl>
                        <CardHeader 
                            title="Song Search"
                            subheader="Please include the name of the artist who performs the song for the quickest and most accurate search result..." 
                            subheaderTypographyProps={{ width: "28rem" }}
                        />
                        <Box display='flex' justifyContent='center'>
                            <TextField 
                                InputLabelProps={{ shrink: true }} 
                                autoFocus 
                                variant="outlined" 
                                error={invalidSearch} 
                                required 
                                className={classes.textField} 
                                onChange={handleSongChange} 
                                value={songValue} 
                                label={invalidSearch ? "Error" : "Song"}
                                helperText={invalidSearch ? 'Song title is required' : null}
                            />
                        </Box>
                        <br />
                        <Box display='flex' justifyContent='center'>
                            <TextField InputLabelProps={{ shrink: true }} variant="outlined" className={classes.textField} onChange={handlePerformerChange} value={performerValue} label="Performer" />
                        </Box>
                        <br />
                        <br />
                        <Grid>
                            <Button type="submit" className={classes.button} onClick={handleSubmit(onSubmit)}>Submit</Button>
                            <Button 
                                className={classes.button} 
                                onClick={handleReset}>
                                Reset
                            </Button>
                        </Grid>
                        <br />
                    </FormControl>
                </form>
            </Card>
        </Grid>
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
  );
};

const mapStateToProps = state => {
  return {
    songData: state.song.songData,
    query: state.song.query || {},
    error: state.song.error,
  };
};

const mapDispatchToProps = dispatch => ({
    onSearchPressed: (query) => dispatch(searchSongRequest(query)),
    onDataLoaded: (songData, query) => dispatch(searchSongSuccess(songData, query))
})

export default connect(mapStateToProps, mapDispatchToProps)(SongForm)