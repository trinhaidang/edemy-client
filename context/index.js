import { useReducer, createContext, useEffect } from "react";
import { ActionEnum } from "../common/constants";


// initial state
const initialState = {
    user: null,
};

// root reducer
const rootReducer = (state, action) => {
    switch (action.type) {
        case ActionEnum.login:
            return { ...state, user: action.payload };
        case ActionEnum.logout:
            return { ...state, user: null };
        default:
            return state;
    }
}

// create context
const Context = createContext();
const ContextProvider = ({ children }) => {
    // preferable to useState case complex state logic w multiple sub-values; pass dispatch thay callbacks -> trigger deep updates 
    const [state, dispatch] = useReducer(rootReducer, initialState);
    // find user from localStorage every time reload page or redirect
    useEffect(() => {
        dispatch({
            type: ActionEnum.login,
            payload: JSON.parse(window.localStorage.getItem("user")),
        });
    }, []);

    return (
        <Context.Provider value={{ state, dispatch }} >
            {children}
        </Context.Provider>
    );
}

export { Context, ContextProvider };
