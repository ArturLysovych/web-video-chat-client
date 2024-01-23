import { useCallback, useEffect, useRef, useState } from "react";

const useStateWithCallback = (initialState: string) => {
    const [state, setState] = useState(initialState);
    const cbRef = useRef<any>();

    const updateState = useCallback((newState: any, cb: VoidFunction) => {
        cbRef.current = cb;
        setState((prev: any) => typeof newState === 'function' ? newState(prev) : newState);
    }, []);

    useEffect(() => {
        if (cbRef.current) {
            cbRef.current(state);
            cbRef.current = null;
        }
    }, [state, cbRef.current]);

    return [state, updateState] as any[];
};

export default useStateWithCallback;