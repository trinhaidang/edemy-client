import { useContext, useEffect, useState } from "react";
import { Context } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import axios from "axios";
import { toast } from "react-toastify";
import { PlayCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { DEFAULT_COURSE_IMG } from "../../common/constants";
import Link from "next/link";

const API_USER_COURSES = "/api/user-courses";

const UserIndex = () => {

    const { state: { user } } = useContext(Context);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        loadUserCourses();
    }, []);
    const loadUserCourses = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(API_USER_COURSES);
            setCourses(data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.log(err);
            toast("Load User Courses failed. Refresh page to try again");
        }
    }

    return (
        <UserRoute>
            {loading && <SyncOutlined spin className="d-flex justify-content-center display-1 text-danger p-5" />}
            <h1 className="jumbotron text-center square">My Learning</h1>
            {/* <pre>{JSON.stringify(courses, null, 4)}</pre> */}
            <div className="container-fluid">
                <div className="row">
                    {courses && courses.map(course => (
                        <div key={course._id} className="col-lg-6 pt-2 pb-1">
                            <div className="row">
                                <Avatar className="col-3" size={80} shape="square" src={course.image ? course.image.Location : DEFAULT_COURSE_IMG} />

                                <div className="col-8">
                                    <Link href={`/user/course/${course.slug}`} >
                                        <a><h5 className="mt-2 text-primary">{course.name}</h5></a>
                                    </Link>
                                    <p style={{ marginTop: "-0.25rem" }}>{course.lessons.length} Lessons</p>
                                    <p className="text-muted" style={{ marginTop: "-1.25rem", fontSize: "1rem" }}>By {course.instructor.name}</p>
                                </div>
                                <div className="col-1 mt-3 text-center">
                                    <Link href={`/user/course/${course.slug}`} >
                                        <a><PlayCircleOutlined className="h2 pointer text-primary" /></a>
                                    </Link>
                                </div>
                            </div>


                        </div>
                    ))}
                </div>
            </div>
        </UserRoute>
    );
}

export default UserIndex;