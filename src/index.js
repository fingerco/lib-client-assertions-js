import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Prediction from "./Prediction";

const USER_ID_KEY = "client-assertions-user-id";

class ClientAssertions {
  constructor() {
    this.userId = window.localStorage.getItem(USER_ID_KEY);
    this.predictions = [];
    this.predictionNextSteps = {};

    if (!this.userId) {
      this.userId = uuidv4();
      window.localStorage.setItem(USER_ID_KEY, this.userId);
    }
  }

  assert = (name, value) => {
    if (!value) {
      this.predictionEventHappened("assertionFailure", name);
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
    } else {
      this.predictionEventHappened("assertionSuccess", name);
    }
  };

  createPrediction = (id, secondsToExist) => {
    const prediction = new Prediction(this, id, secondsToExist);
    this.predictions.push(prediction);

    return prediction;
  };

  preloadPredictions = () => {
    this.predictions.forEach((pred) => pred.preloadData());
  };

  predictionNextStep = (prediction, step) => {
    this.predictionNextSteps[prediction.id] = step;
  };

  predictionEventHappened = (type, name, value = null) => {
    Object.values(this.predictionNextSteps).forEach((step) => {
      step.eventHappened(type, name, value);
    });
  };
}

export default ClientAssertions;
