import { createContext, type FC, type Reducer, useReducer } from "react";
import type { ICRAILContext, CRAILContextAction, CRAILContextState, CRAILWrapperProps } from "./proptypes";

const initialState: CRAILContextState = {
    showSpinner: false,
};

export const CRAILContext = createContext<ICRAILContext>({
    state: { ...initialState },
    dispatch: () => {
        throw new Error('dispatch function must be overridden');
    }
});

export const CONTEXT_PATHS = {
    SHOW_SPINNER: 'SHOW_SPINNER',
}

const CRAILContextReducer: Reducer<CRAILContextState, CRAILContextAction> = (state, action) => {
    switch (action.type) {
        case CONTEXT_PATHS.SHOW_SPINNER:
            console.log("Reducer action:", action.type, "with payload:", action.payload);
            return {
                ...state,
                showSpinner: action.payload.showSpinner,
            };
        default:
            console.warn(`Unhandled action type: ${action.type}`);
            return state;
    }
};

const CRAILContextWrapper: FC<CRAILWrapperProps> = ({ children }) => {
    const [state, dispatch] = useReducer(CRAILContextReducer, initialState);

    const value = { state, dispatch };
    return (
        <CRAILContext.Provider value={value}>
            {children}
        </CRAILContext.Provider>
    );
};

export default CRAILContextWrapper;