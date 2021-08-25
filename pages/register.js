import { useState } from "react";


const Register = () => {


    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, SetPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.table({ name, email, password });
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
                    <button type="submit" className="form-control btn btn-block btn-primary p-2">Submit</button>
                </form>
            </div>
        </>
    )
}

export default Register;