import { makeStyles, Tab, Tabs, Box } from "@material-ui/core";
import { Chat, GroupAdd, People } from "@material-ui/icons";
import React, { createContext, useState } from "react";
import FriendList from "./FriendList";
import FindFriends from "./FindFriends/index";
import ConversationsContainer from "./ConversationsContainer";

//creating the contexts
const FriendListContext = createContext();
const MessagesContext = createContext();
const FriendRequestsContext = createContext();
const PendingFriendRequestsContext = createContext();
const PeopleYouMayKnowContext = createContext();

const useStyles = makeStyles({
  tab: {
    width: `${(1 / 3) * 100}%`,
    "@media (min-width: 600px)": {
      minWidth: "60px",
    },
  },
});

function SelectionMenu() {
  const classes = useStyles();
  const [index, setIndex] = useState(0);


  const handleChange = (event, newIndex) => {
    setIndex(newIndex);
  };
  return (
    <>
      <Box>
        <Tabs
          value={index}
          onChange={handleChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="icon tabs example"
        >
          <Tab className={classes.tab} icon={<Chat />} aria-label="phone" />
          <Tab
            className={classes.tab}
            icon={<People />}
            aria-label="favorite"
          />
          <Tab
            className={classes.tab}
            icon={<GroupAdd />}
            aria-label="person"
          />
        </Tabs>
      </Box>
      <TabPanel
        components={[
            <ConversationsContainer />,
            <FriendList />,
            <FindFriends />
        ]}
        index={index}
      />
    </>
  );
}

function TabPanel({ components, index }) {
  return components[index];
}

export default SelectionMenu;
export {
  MessagesContext,
  FriendListContext,
  FriendRequestsContext,
  PendingFriendRequestsContext,
  PeopleYouMayKnowContext,
};
