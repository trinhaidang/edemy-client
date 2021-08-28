import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { ActionEnum } from "../common/constants";
import { useRouter } from "next/router";


const Login = () => {

    const [email, setEmail] = useState("");
    const [password, SetPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { state: {user}, dispatch } = useContext(Context);

    // router
    const router = useRouter();

    useEffect(() => {
        if(user !== null) router.push("/user");
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.table({ name, email, password });
        try {
            setLoading(true);
            const { data } = await axios.post(`/api/login`, {
                email, password
            });
            // console.log("LOGIN RESPONSE: ", data); // -> user

            // save data to context state
            dispatch({
                type: ActionEnum.LOGIN,
                payload: data,
            });
            //save data to localStorage
            window.localStorage.setItem("user", JSON.stringify(data));

            // redirect
            router.push("/user");

            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error(error.response.data);
        }
    }

    return (
        <>
            <h1 className="jumbotron text-center bg-primary square">Login</h1>
            <div className="container col-md-4 offset-md-4 pb-5">
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className="form-control mb-4 p-3"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        required
                    />
                    <input
                        type="password"
                        className="form-control mb-4 p-3"
                        value={password}
                        onChange={(e) => SetPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                    />
                    <button
                        type="submit"
                        className="form-control btn btn-block btn-primary p-2"
                        disabled={!email || !password || loading}
                    >
                        {loading ? <SyncOutlined spin /> : "Submit"}
                    </button>
                </form>
                <p className="text-center pt-3">
                    Not yet registered?{"  "}
                    <Link href="/register">
                        <a>Register</a>
                    </Link>
                </p>
                <p className="text-center">
                    <Link href="/forgot-password">
                        <a className="text-danger">Forgot password</a>
                    </Link>
                </p>
            </div>
        </>
    )
}

export default Login;