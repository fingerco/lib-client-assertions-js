import axios from "axios";

class Prediction {
  constructor(assertionClient, id, secondsToExist) {
    this.assertionClient = assertionClient;
    this.id = id;
    this.steps = [];
    this.reportSteps = [];
    this.stepsTaken = [];
    this.secondsToExist = secondsToExist;
    this.startedAt = new Date().toISOString();

    this.preloadData();
  }

  addStep(type, name, value) {
    const stepNum = this.steps.length;
    const step = new PredictionStep(this, stepNum, type, name, value);
    this.steps.push(step);

    return step;
  }

  reportWhenHitStep = (stepNum) => {
    this.reportSteps.push(stepNum);
  };

  assertionFailure() {
    return "assertionFailure";
  }

  assertionSuccess() {
    return "assertionSuccess";
  }

  eventHappen() {
    return "eventHappen";
  }

  eventNotHappen() {
    return "eventNotHappen";
  }

  actionTaken() {
    return "actionTaken";
  }

  actionNotTaken() {
    return "actionNotTaken";
  }

  valueGreaterThan() {
    return "valueGreaterThan";
  }

  valueLessThan() {
    return "valueLessThan";
  }

  valueEqual() {
    return "valueEqual";
  }

  preloadData() {
    const getExisting = axios.get(
      `https://assertions-api.chattyops.com/predictions/states/${this.assertionClient.userId}/${this.id}`
    );

    return getExisting.then((data) => console.log(data));
  }

  saveState() {
    const saveState = axios.post(
      `http://localhost:3000/predictions/states/${this.assertionClient.userId}/${this.id}`,
      {
        steps_taken: this.stepsTaken,
        started_at: this.startedAt,
        time_to_exist: this.secondsToExist,
      }
    );

    return saveState;
  }
}

class PredictionStep {
  constructor(prediction, stepNum, type, name, value) {
    this.prediction = prediction;
    this.stepNum = stepNum;
    this.type = type;
    this.name = name;
    this.value = value;
  }

  reportOnHit() {
    this.prediction.reportWhenHitStep(this.stepNum);
  }
}

export default Prediction;
