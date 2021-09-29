import React ,{useState} from "react";
import { Box, IconButton, makeStyles } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import theme from "../../../../theme";

const useStyles = makeStyles({
  searchInput: {
    color:theme.palette.text.primary ,
    fontSize: "1rem",
    background: "transparent",
    outline: "none",
    border: "none",
    width: "100%",
    "&::placeholder": {
      color:theme.palette.text.secondary,
      fontSize: "1rem",
    },
  },
});

function SearchBox() {
  const classes = useStyles();
  const [searchText, setSearchText] = useState();

  function handleChange(e){
      setSearchText(e.target.value)
  }
  return (
    <form>
      <Box
        m="1em"
        pl="1em"
        display="flex"
        alignItems="center"
        borderRadius="5px"
        boxShadow={3}
      >
        <input className={classes.searchInput}  placeholder="Search..." value={searchText} onChange={(e)=>{handleChange(e)}} />
        <IconButton type="submit">
          <Search />
        </IconButton>
      </Box>
    </form>
  );
}

export default SearchBox;
