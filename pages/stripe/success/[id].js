import { SyncOutlined } from "@ant-design/icons";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import UserRoute from "../../../components/routes/UserRoute";

const API_STRIPE_SUCCESS = "/api/stripe-success"

const StripeSuccess = () => {
    const router = useRouter();
    const {id} = router.query;
    console.log("StripeSuccess-----: ", router.query);
    useEffect(() => {
        if(id) successRequest();
    }, [id])
    const successRequest = async () => {
        const {data} = await axios.post(`${API_STRIPE_SUCCESS}/${id}`);
        console.log("successRequest: ", data);
        if(data.ok) router.push(`/user/course/${data.course.slug}`);
    };

    return (
        <UserRoute showNav={false}>
            <div className="row text-center">
                <div className="col-md-9 pb-5">
                    <div className="d-flex justify-content-center p-5">
                        <SyncOutlined spin className="display-1 text-danger p-5" />
                    </div>
                </div>
                <div className="col-md-9"></div>
            </div>
        </UserRoute>
    );
};

export default StripeSuccess;