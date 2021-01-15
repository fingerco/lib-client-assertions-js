let ClientAssertions = window.ClientAssertions.default;
let assertions = new ClientAssertions();

const predict = assertions.createPrediction('prediction_uuid_123', 3600)
predict.addStep(predict.assertionFailure(), 'some_odd_thing')
predict.addStep(predict.assertionSuccess(), 'some_odd_thing')
predict.addStep(predict.eventHappen(), 'pass_the_salt')
predict.addStep(predict.eventNotHappen(), 'pass_the_salt')
predict.addStep(predict.actionTaken(), 'do_something')
predict.addStep(predict.actionNotTaken(), 'pass_the_salt')
predict.addStep(predict.valueGreaterThan(), 'absolute', 5)
predict.addStep(predict.valueLessThan(), 'absolute', 5)
predict.addStep(predict.valueEqual(), 'absolute', 5).reportOnHit()

assertions.assert('some_odd_thing', false)
