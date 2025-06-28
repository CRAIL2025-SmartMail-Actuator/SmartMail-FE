import type { ReactNode, Dispatch } from "react";

export interface CRAILContextState {
    showSpinner?: boolean;
}

export interface CRAILContextAction {
    type: string;
    payload: CRAILContextState;
}

export interface ICRAILContext {
    state: CRAILContextState;
    dispatch: Dispatch<CRAILContextAction>
}

export interface CRAILWrapperProps {
    children: ReactNode | ReactNode[];
}