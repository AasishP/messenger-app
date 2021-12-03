import React, { useEffect, useState } from "react";
import { Box, IconButton, makeStyles } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import SearchResults from "./SearchResults";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "1em",
  },
  searchForm: {
    display: "flex",
    paddingLeft: "1em",
    width: "100%",
  },
  searchInput: {
    color: theme.palette.text.primary,
    fontSize: "1rem",
    background: "transparent",
    outline: "none",
    border: "none",
    width: "100%",
    "&::placeholder": {
      color: theme.palette.text.secondary,
      fontSize: "1rem",
    },
  },
}));

function SearchBox() {
  const classes = useStyles();
  const [searchText, setSearchText] = useState();
  const [showSearchResults, setShowSearchResults] = useState(false);

  function handleChange(e) {
    setSearchText(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    searchText && setShowSearchResults(true);
  }

  useEffect(() => {
    searchText ? setShowSearchResults(true) : setShowSearchResults(false);
  }, [searchText]);

  return (
    <Box
      className={classes.root}
      borderRadius="5px"
      boxShadow="rgb(145 158 171 / 10%) 0px 2px 5px 3px"
      tabIndex="-1"
      onFocus={() => {
        searchText && !showSearchResults && setShowSearchResults(true);
      }}
    >
      <form className={classes.searchForm} onSubmit={handleSubmit}>
        <input
          className={classes.searchInput}
          placeholder="Search..."
          value={searchText}
          onFocus={() => {
            searchText && setShowSearchResults(true);
          }}
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <IconButton type="submit">
          <Search />
        </IconButton>
      </form>
      {showSearchResults ? (
        <SearchResults
          searchText={searchText}
        />
      ) : null}
    </Box>
  );
}

export default SearchBox;
