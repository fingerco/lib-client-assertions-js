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
  }

  addStep(type, name, value = null) {
    const stepNum = this.steps.length;
    const step = new PredictionStep(this, stepNum, type, name, value);
    this.steps.push(step);

    if (stepNum === 0) this.assertionClient.predictionNextStep(this, step);

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

  stepHappened(step) {
    const currStep = this.steps[step.stepNum];
    currStep.hit();

    this.stepsTaken.push(this.stepsTaken.length);

    if (step.stepNum < this.steps.length - 1) {
      const nextStep = this.steps[step.stepNum + 1];
      this.assertionClient.predictionNextStep(this, nextStep);
    }

    this.saveState();
  }

  preloadData() {
    const getExisting = axios.get(
      `https://assertions-api.chattyops.com/predictions/states/${this.assertionClient.userId}/${this.id}`
    );

    return getExisting.then((resp) => {
      const data = resp.data;
      if (data) {
        this.stepsTaken = data.steps_taken;
        this.startedAt = data.started_at;
        this.secondsToExist =
          (new Date(data.time_to_exist).getTime() - new Date().getTime()) /
          1000;

        this.assertionClient.predictionNextStep(
          this,
          this.steps[this.stepsTaken.length]
        );
      }
    });
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

  eventHappened(type, name, value) {
    if (this.type === type && this.name === name && this.value === value) {
      this.prediction.stepHappened(this);
    }
  }

  hit() {
    console.log("Step Happened:", this.type, this.name, this.value);
  }
}

export default Prediction;
