import { Backdrop } from "@mui/material";
import type { FC } from "react";
import { useCRAILContext } from "../contexts/useCRAILContext";
import loader from '../assets/loader.gif';

const ScreenLoader: FC = () => {
    const {
        state: { showSpinner },
    } = useCRAILContext();

    const styles = {
        backdrop: {
            zIndex: 9999,
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        } as const,
        image: {
            width: '300px', // Adjust size as needed
            height: '300px',
        },
    };
    console.log('ScreenLoader rendered with showSpinner:', showSpinner);

    return (
        <Backdrop aria-hidden={false} open={Boolean(showSpinner)} style={styles.backdrop}>
            <img src={loader} alt="Loading..." style={styles.image} />
        </Backdrop>
    );
};

export default ScreenLoader;
