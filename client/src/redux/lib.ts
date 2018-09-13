import { AnyAction, Reducer } from "redux";

type ReducerFunction<T> = (state: T, ...args: any[]) => T;

export const createReducer = <State>(
  defaultState: State,
  actions: ReducerMap<State>
): Reducer<State> => (state: State | undefined, action: AnyAction) =>
  (actions[action.type] || ((state, _x) => state))(
    state === undefined ? defaultState : state,
    action.payload
  );

export type ReducerMap<State> = {
  [actionType: string]: ReducerFunction<State>;
};
