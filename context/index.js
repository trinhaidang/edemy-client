import axios from "axios";
import { useRouter } from "next/router";
import { useReducer, createContext, useEffect } from "react";
import { ActionEnum } from "../common/constants";


// initial state
const initialState = {
    user: null,
};

// root reducer
const rootReducer = (state, action) => {
    switch (action.type) {
        case ActionEnum.LOGIN:
            return { ...state, user: action.payload };
        case ActionEnum.LOGOUT:
            return { ...state, user: null };
        default:
            return state;
    }
}

// get csrf token -> set to headers
const getCsrfToken = async () => {
    const { data } = await axios.get("/api/csrf-token");
    // console.log("CSRF", data);
    axios.defaults.headers["X-CSRF-Token"] = data.csrfToken;
};

// create context
const Context = createContext();
const ContextProvider = ({ children }) => {
    // preferable to useState case complex state logic w multiple sub-values; pass dispatch thay callbacks -> trigger deep updates 
    const [state, dispatch] = useReducer(rootReducer, initialState);
    // find user from localStorage every time reload page or redirect <=> setState
    useEffect(() => {
        dispatch({
            type: ActionEnum.LOGIN,
            payload: JSON.parse(window.localStorage.getItem("user")),
        });
        getCsrfToken();
    }, []);

    // handle response
    const router = useRouter();
    axios.interceptors.response.use(
        function (response) {   // trigger when status code 2xx (success)
            return response;
        },
        function (error) {    // trigger when response error, status code != 2xx
            let res = error.response;
            if (res.status === 401 && res.config && !res.config.__isRetryRequest) {  // when token expires or forbidden resource
                return new Promise((resolve, reject) => {
                    axios.get("/api/logout").then((data) => {
                        console.log("/401 error > logout");
                        dispatch({ type: ActionEnum.LOGOUT });
                        window.localStorage.removeItem("user");
                        router.push("/login");
                    }).catch((err) => {
                        console.log("AXIOS INTERCEPTORS ERR", err);
                        reject(err);
                    });
                });
            }
            return Promise.reject(error);
        }
    );

    return (
        <Context.Provider value={{ state, dispatch }} >
            {children}
        </Context.Provider>
    );
}

export { Context, ContextProvider };
