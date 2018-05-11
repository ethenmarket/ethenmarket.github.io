import { take } from "redux-saga/effects";

export function* waitFor(actions, callback) {
  const actionsRequired = actions;
  const happenedActions = [];
  while (true) {
    const action = yield take(actionsRequired);
    happenedActions.push(action.type);
    const isReady = actionsRequired.every(act => happenedActions.includes(act));
    if (isReady) {
      yield callback();
    }
  }
};

export function* resolveRace(condition, dependsOn, action) {
  const conditionResult = yield condition();
  if (conditionResult) {
    yield action();
  } else {
    yield waitFor(dependsOn, action);
  }
}