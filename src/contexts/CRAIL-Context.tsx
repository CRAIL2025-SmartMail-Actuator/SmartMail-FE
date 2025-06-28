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

const CRAILContextReducer: Reducer<CRAILContextState, CRAILContextAction> = (state, action) => {
    switch (action.type) {
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