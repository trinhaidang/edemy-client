import { SyncOutlined } from "@ant-design/icons";
import Password from "antd/lib/input/Password";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react"
import { toast } from "react-toastify";
import { Context } from "../context";


const Forgotpassword = () => {

    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);    // sent email success
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { state: { user } } = useContext(Context);
    const router = useRouter();

    useEffect(() => {
        if (user !== null) router.push("/");
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post("/api/forgot-password", { email });
            setSuccess(true);
            toast("Check your email for the secret code");
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
            toast(err.response.data);
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault();
        // console.log(email, code, newPassword);
        try {
            setLoading(true);
            const { data } = await axios.post("/api/reset-password", { email, code, newPassword });
            setEmail('');
            setCode('');
            setNewPassword('');
            setLoading(false);
            toast("Reset Password Successfully. Login now.");
        } catch (err) {
            console.log(err);
            setLoading(false);
            toast(err.response.data);
        }
    }

    return (
        <>
            <h1 className="jumbotron text-center bg-primary square">Forgot password</h1>
            <div className="container col-md-4 offset-md-4 pb-5">
                <form onSubmit={success ? handleResetPassword : handleSubmit}>
                    <input
                        type="email" className="form-control mb-4 p-3" placeholder="Enter Email" required
                        value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                    {success &&
                        <>
                            <input
                                type="text" className="form-control mb-4 p-3" placeholder="Enter Code Sent to your email" required
                                value={code} onChange={(e) => setCode(e.target.value)}
                            />
                            <input
                                type="password" className="form-control mb-4 p-3" placeholder="Enter New password" required
                                value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </>}
                    <button
                        className="form-control btn btn-primary btn-block p-2"
                        type="submit" disabled={loading || !email}
                    >
                        {loading ? <SyncOutlined spin /> : "Submit"}
                    </button>
                </form>

            </div>
        </>
    );
}

export default Forgotpassword;