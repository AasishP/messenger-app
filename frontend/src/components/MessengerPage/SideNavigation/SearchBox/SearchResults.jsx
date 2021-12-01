import {
  Box,
  Divider,
  makeStyles,
  Typography,
  useTheme,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import axios from "../../../../api";
import axiosMain from "axios";
import People from "../People";

const useStyles = makeStyles((theme) => ({
  searchResults: {
    position: "absolute",
    width: "100%",
    top: "100%",
    left: "0",
    backgroundColor: theme.palette.background.paper,
    borderRadius: "0 0 10px 10px",
    zIndex: "1000",
    boxShadow: "rgb(145 158 171 / 10%) 0px 2px 5px 3px",
  },
}));

function SearchResults({ searchText, setShowSearchResults }) {
  const theme = useTheme();
  const classes = useStyles();
  const [searchResults, setSearchResults] = useState([]);
  const [changed, setChanged] = useState();
  const searchResultsContainer = useRef();

  function update() {
    setChanged(Math.random());
  }

  useEffect(() => {
    const cancelTokenSource = axiosMain.CancelToken.source();

    async function getSearchResults(searchTerm) {
      const res = await axios.get(`/search?search_term=${searchTerm}`, {
        cancelToken: cancelTokenSource.token,
      });
      return res.data;
    }

    if (searchText) {
      getSearchResults(searchText).then((results) => {
        setSearchResults(results);
      });
    }

    return () => {
      cancelTokenSource.cancel();
    };
  }, [changed, searchText]);

  return (
    <Box
      className={classes.searchResults}
      ref={searchResultsContainer}
      onBlur={() => {
        setShowSearchResults(false);
      }}
    >
      <Divider size="large" />

      {searchText && !searchResults.length ? (
        <Typography
          style={{ margin: "0.5em" }}
          align="center"
          color="textSecondary"
        >
          No Results Found!
        </Typography>
      ) : null}

      {/* friends */}
      {searchResults?.map((person) => {
        if (person.isFriend) {
          return (
            <People
              key={person._id}
              person={person}
              type="friend"
              update={update}
            />
          );
        }
        return null;
      })}

      {/* more People (unknown persons) */}
      {searchResults.some((person) => {
        return !person.isFriend;
      }) ? (
        <>
          <Typography
            variant="body1"
            style={{
              fontWeight: "bold",
              marginLeft: "0.7em",
              marginTop: "0.3em",
              color: theme.palette.grey[800],
            }}
          >
            More People
          </Typography>
          {searchResults?.map((person) => {
            if (person.isRequestPending)
              return (
                <People
                  key={person._id}
                  type="pendingRequest"
                  person={person}
                />
              );
            if (person.hasSentFriendRequest)
              return (
                <People
                  key={person._id}
                  type="friendRequest"
                  person={person}
                  update={update}
                />
              );
            if (!person.isFriend) {
              return (
                <People
                  key={person._id}
                  type="unknown"
                  person={person}
                  update={update}
                />
              );
            }
            return null;
          })}
        </>
      ) : null}
    </Box>
  );
}

export default SearchResults;
