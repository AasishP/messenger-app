import React, { useEffect, useState } from "react";
import { Box, IconButton, makeStyles } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import SearchResults from "./SearchResults";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
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

  useEffect(() => {
    searchText ? setShowSearchResults(true) : setShowSearchResults(false);
  }, [searchText]);

  return (
    <form>
      <Box
        className={classes.root}
        m="1em"
        pl="1em"
        display="flex"
        alignItems="center"
        borderRadius="5px"
        boxShadow="rgb(145 158 171 / 10%) 0px 2px 5px 3px"
      >
        <input
          className={classes.searchInput}
          placeholder="Search..."
          value={searchText}
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <IconButton type="submit">
          <Search />
        </IconButton>
        {showSearchResults ? (
          <SearchResults
            searchText={searchText}
            setShowSearchResults={setShowSearchResults}
          />
        ) : null}
      </Box>
    </form>
  );
}

export default SearchBox;
