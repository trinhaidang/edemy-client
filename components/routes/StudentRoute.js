import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";

const API_URRENT_USER = "/api/current-user";

const StudentRoute = ({ children, showNav = true }) => {

    const [ok, setOk] = useState(false);
    const router = useRouter();
    const fetchUser = async () => {
        try {
            const { data } = await axios.get(API_URRENT_USER);
            // console.log(data);
            if (data.ok) setOk(true);
        } catch (err) {
            console.log(err);
            setOk(false);
            router.push("/");
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);
    return (
        <>
            {
                !ok ? <SyncOutlined spin className="d-flex justify-content-center display-1 text-primary p-5" />
                    : (
                        <div className="container-fluid">
                            {children}
                        </div>
                    )
            }
        </>
    );
}

export default StudentRoute;