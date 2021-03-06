import React, { useEffect, useRef, useState } from "react";
import { Box, IconButton, makeStyles } from "@material-ui/core";
import SearchResults from "./SearchResults";
import { Search } from "@material-ui/icons";

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
  //refs
  const searchBoxRef = useRef();

  function handleChange(e) {
    setSearchText(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    searchText && setShowSearchResults(true);
  }

  function handleClickOutside(e) {
    if (searchBoxRef.current && !searchBoxRef.current.contains(e.target))
      setShowSearchResults(false);
  }

  useEffect(() => {
    searchText ? setShowSearchResults(true) : setShowSearchResults(false);
  }, [searchText]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Box
        className={classes.root}
        borderRadius="5px"
        boxShadow="rgb(145 158 171 / 10%) 0px 2px 5px 3px"
        tabIndex="-1"
        onFocus={() => {
          searchText && !showSearchResults && setShowSearchResults(true);
        }}
        ref={searchBoxRef}
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
        {showSearchResults ? <SearchResults searchText={searchText} /> : null}
      </Box>
    </>
  );
}

export default SearchBox;
