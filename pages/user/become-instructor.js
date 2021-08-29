import { LoadingOutlined, SettingOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { useContext, useState } from "react";
import { Context } from "../../context";
import { Button } from "antd";
import { RoleEnum } from "../../common/constants";
import axios from "axios";
import { toast } from "react-toastify";

const API_MAKE_INSTRUCTOR = "/api/make-instructor";

const BecomeInstructor = () => {

    const [loading, setLoading] = useState(false);
    const { state: { user } } = useContext(Context);
    const handleBecomeInstructor = () => {
        // console.log("handleBecomeInstructor", user);
        setLoading(true);
        axios.post(API_MAKE_INSTRUCTOR)
        .then(res => {
            setLoading(false);
            // console.log(res.data);
            window.location.href= res.data;
        })
        .catch(err => {
            setLoading(false);
            console.log(err.response.data);
            toast("Stripe onboarding failed. Try again.");
        });
    };

    return (
        <>
            <h1 className="jumbotron text-center square">Become Instructor</h1>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3 text-center">
                        <div className="pt-4">
                            <UserSwitchOutlined className="display-1 pb-3" />
                            <h2>Setup payout to publish courses</h2>
                            <p className="lead text-warning">Vietcourse partners with Stripe to transfer earnings to your bank account</p>
                            <Button
                                className="mb-3" type="primary" block shape="round" size="large"
                                icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
                                onClick={handleBecomeInstructor}
                                disabled={loading || (user && user.role && user.role.includes(RoleEnum.INSTRUCTOR))}
                            >
                                {loading ? "Processing..." : "Payout Setup"}
                            </Button>
                            <p className="lead">You will be redirected to Stripe to complete onboarding process</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BecomeInstructor;