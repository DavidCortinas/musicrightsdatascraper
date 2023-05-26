import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Box, Button, Card, CardHeader, CircularProgress, FormControl, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { makeStyles } from '@mui/styles';
// import { searchSong } from "../actions";
import { searchSongRequest } from '../thunks'
import { searchSongSuccess } from "../actions";

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
    }
}))

export const SongForm = ({ onSearchPressed, onDataLoaded, query }) => {
  const { handleSubmit } = useForm();
  const [songValue, setSongValue] = useState('');
  const [performerValue, setPerformerValue] = useState('');
  const [isLoading, setIsLoading] = useState(false); 


  const onSubmit = async () => {
    setIsLoading(true);

    const newQuery = {
      song: songValue,
      performer: performerValue,
    };
    const songData = await onSearchPressed(newQuery);

    console.log(songData)

    setIsLoading(false);
    onDataLoaded(songData, newQuery);
  };


  const classes = useStyles();

  return isLoading ? (
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
    <Grid container justifyContent="center">
        <Card className={classes.card}>
            <FormControl>
                <CardHeader 
                    title="Song Search"
                    subheader="Please include the name of the artist who performs the song for the quickest and most accurate search result..." 
                    subheaderTypographyProps={{ width: "28rem" }}
                />
                <Box display='flex' justifyContent='center'>
                    <TextField InputLabelProps={{ shrink: true }} autoFocus variant="outlined" required className={classes.textField} onChange={(e) => setSongValue(e.target.value)} value={songValue} label="Song" />
                </Box>
                <br />
                <Box display='flex' justifyContent='center'>
                    <TextField InputLabelProps={{ shrink: true }} variant="outlined" className={classes.textField} onChange={(e) => setPerformerValue(e.target.value)} value={performerValue} label="Performer" />
                </Box>
                <br />
                <br />
                <Grid>
                    <Button className={classes.button} onClick={handleSubmit(onSubmit)}>Submit</Button>
                    <Button 
                        className={classes.button} 
                        onClick={() => {
                            setSongValue("");
                            setPerformerValue("")
                    }}>
                        Reset
                    </Button>
                </Grid>
                <br />
            </FormControl>
        </Card>
    </Grid>
  );
};

const mapStateToProps = state => {
console.log(state)
  return {
    songData: state.song.songData,
    query: state.song.query || {},
  };
};

const mapDispatchToProps = dispatch => ({
    onSearchPressed: async (query) => {
        const songData = await dispatch(searchSongRequest(query));
        return songData;
    },
    onDataLoaded: (songData, query) => dispatch(searchSongSuccess(songData, query))
})

export default connect(mapStateToProps, mapDispatchToProps)(SongForm)