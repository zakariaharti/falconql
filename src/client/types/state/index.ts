// apollo common types
// -----------------------------------------------------------------------------

/* STATE */
export interface IState {
  count: number;
}

// 'Root', which contains the 'State' ke
export interface IRoot {
  state: IState;
}

export interface IIncrementCount {
  incrementCount: () => void
}
