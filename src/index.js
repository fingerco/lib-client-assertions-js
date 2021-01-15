import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Prediction from "./Prediction";

const USER_ID_KEY = "client-assertions-user-id";

class ClientAssertions {
  constructor() {
    this.userId = window.localStorage.getItem(USER_ID_KEY);
    if (!this.userId) {
      this.userId = uuidv4();
      window.localStorage.setItem(USER_ID_KEY, this.userId);
    }
  }

  assert = (name, value) => {
    if (!value) {
      const currDate = new Date();

      return axios.post(
        "https://assertions-api.chattyops.com/assertions/failures",
        {
          id: uuidv4(),
          failed_at: currDate.toISOString(),
          user_id: this.userId,
          assertion_name: name,
        }
      );
    }
  };

  createPrediction = (id, secondsToExist) => {
    return new Prediction(this, id, secondsToExist);
  };
}

export default ClientAssertions;
