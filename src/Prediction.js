class Prediction {
  constructor(id) {
    this.id = id;
    this.steps = [];
    this.reportSteps = [];
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
