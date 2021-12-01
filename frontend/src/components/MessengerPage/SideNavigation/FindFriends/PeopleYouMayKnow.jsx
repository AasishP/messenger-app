import { Box, Typography } from "@material-ui/core";
import { EmojiPeople } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import axios from "../../../../api";
import People from "../People";

function PeopleYouMayKnow({ update, changed }) {
  const [peopleYouMayKnow, setPeopleYouMayKnow] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await axios.get("/peopleyoumayknow");
      setPeopleYouMayKnow(res.data);
      setLoading(false);
    })();
  }, [changed]);

  return (
    <Box mt="1em">
      <Typography variant="h6" align="center" color="primary">
        <EmojiPeople />
        People You May Know
      </Typography>
      {!loading && peopleYouMayKnow.length === 0 && (
        <Box px={5}>
          <Typography variant="body1" align="center" color="textSecondary">
            When you have friend's suggestions, you'll see them here.
          </Typography>
        </Box>
      )}
      {!loading &&
        peopleYouMayKnow.length !== 0 &&
        peopleYouMayKnow.map((Person) => {
          return (
            <People
              key={Person._id}
              person={Person}
              type="unknown"
              update={update}
            />
          );
        })}
    </Box>
  );
}

export default PeopleYouMayKnow;
