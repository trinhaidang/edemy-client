import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";

const API_REGISTER = "/api/register";

const Register = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, SetPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { state: { user } } = useContext(Context);

    const router = useRouter();
    useEffect(() => {
        if (user !== null) router.push("/");
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.table({ name, email, password });
        try {
            setLoading(true);
            const { data } = await axios.post(API_REGISTER, {
                name, email, password
            });
            // console.log("REGISTER RESPONSE: ", data);
            setEmail("");
            setName("");
            setPassword("");
            setLoading(false);
            toast.success("Registration successful. Login now.");
        } catch (error) {
            setLoading(false);
            toast.error(error.response.data);
        }
    }

    return (
        <>
            <h1 className="jumbotron text-center bg-primary square">Register</h1>
            <div className="container col-md-4 offset-md-4 pb-5">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="form-control mb-4 p-3"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter name"
                        required
                    />
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
                        disabled={!name || !email || !password || loading}
                    >
                        {loading ? <SyncOutlined spin /> : "Submit"}
                    </button>
                </form>
                <p className="text-center p-3">
                    Already registered?{" "}
                    <Link href="/login">
                        <a>Login</a>
                    </Link>
                </p>
            </div>
        </>
    )
}

export default Register;