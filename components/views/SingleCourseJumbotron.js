import { Badge, Modal, Button } from "antd";
import ReactPlayer from "react-player";
import { DEFAULT_COURSE_IMG, DEFAULT_CURRENCY } from "../../common/constants";
import { currencyFormatter, getFileExtension } from "../../common/utils";
import {LoadingOutlined, SafetyOutlined} from "@ant-design/icons";



const SingleCourseJumbotron = ({
    course,
    showModal,
    setShowModal,
    preview,
    setPreview,
    user,
    loading,
    handlePaidEnrollment,
    handleFreeEnrollment,
    enrolled,
    setEnrolled
}) => {
    return (
        <div className="jumbotron bg-primary square mx-2">
            <div className="row">
                <div className="col-lg-8 col-md-6">
                    <h1 className="text-light font-weight-bold">{course.name}</h1>
                    <p className="lead">{course.description && course.description.substring(0, 100)}...</p>
                    <Badge count={course.category} style={{ backgroundColor: "#03a9f4" }} className="pb-4 me-2" />
                    <p>Created by {course.instructor.name}</p>
                    <p>Last updated {new Date(course.updatedAt).toLocaleDateString()}</p>
                    <h4 className="text-light">{course.paid ? currencyFormatter({ amount: course.price, currency: course.currency || DEFAULT_CURRENCY }) : "FREE"}</h4>
                </div>
                <div className="col-lg-4 col-md-6">
                    {course.lessons[0].media && course.lessons[0].media.Location
                        ? getFileExtension(course.lessons[0].media.Key) === "pdf"
                            ? (<div>
                                <a href={course.lessons[0].media.Location} target="_blank">PDF FILE</a>
                            </div>)
                            : (<div onClick={() => {
                                setPreview(course.lessons[0].media.Location);
                                setShowModal(!showModal);
                            }}>
                                <ReactPlayer className="react-player-div" url={course.lessons[0].media.Location} width="100%" height="225px" light={course.image.Location} />
                            </div>)
                        : (<img src={course.image.Location || DEFAULT_COURSE_IMG} alt={course.name} className="img img-fluid" />)
                    }
                    {loading ? (
                            <div className="d-flex justify-content-center">
                                <LoadingOutlined className="h1 text-danger"/>
                            </div>
                        )
                        : (
                            <Button 
                                className="my-3" type="danger" block shape="round" icon={<SafetyOutlined />} size="large" disabled={loading}
                                onClick={course.paid ? handlePaidEnrollment : handleFreeEnrollment}
                            >
                                {user ? (enrolled.status ? "Go to course" : "Enroll") : "Login to enroll"}
                            </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SingleCourseJumbotron;