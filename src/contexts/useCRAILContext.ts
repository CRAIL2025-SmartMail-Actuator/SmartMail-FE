import { useContext } from "react";
import { CRAILContext } from "./CRAIL-Context";

const useCRAILContext = () => {
    const context = useContext(CRAILContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within a child of AppContext');
    }
    return context;
}
export { useCRAILContext };
