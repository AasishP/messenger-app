import axios from "../../api";

async function authenticateLoginToken() {
  const accesstoken = window.localStorage.getItem("accesstoken");
  if (accesstoken) {
      //making login request with AccessToken
      const res = await axios.post("/login");
      if (res.status === 200) {
        return {user: res.data}
      }
      //if authentication failed with error it can be catched by catch block.
    }
   else {
    //if accesstoken is not present.
    return false
  }
}

export default authenticateLoginToken;
