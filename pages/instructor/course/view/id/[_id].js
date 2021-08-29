import axios from "axios";
import { Avatar, Tooltip } from "antd";
import { DEFAULT_COURSE_IMG } from "../../../../../common/constants";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import InstructorRoute from "../../../../../components/routes/InstructorRoute";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";

const API_GET_COURSE_BY_ID = "/api/course/id/";

const CourseViewById = () => {

    const [course, setCourse] = useState([]);
    const router = useRouter();
    const { _id: id } = router.query;

    useEffect(() => {
        // console.log(id);
        loadCourse();
    }, [id])

    const loadCourse = async () => {
        const { data } = await axios.get(`${API_GET_COURSE_BY_ID}${id}`);
        setCourse(data.course);
        // console.log(data);
    }

    return (
        <InstructorRoute>
            {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
            <div className="container-fluid pt-3">
                {course && (
                    <div className="container-fluid pt-1">

                        <div className="media pt-2 row">
                            <Avatar size={80} src={course.image ? course.image.Location : DEFAULT_COURSE_IMG} className="col-3"/>
                            <div className="media-body col-9">
                                <div className="row">
                                    <div className="col-11">
                                        <h5 className="mt-2 text-primary">{course.name}</h5>
                                        <p style={{ marginTop: "-10px" }}>{course.lessons && course.lessons.length} Lessons</p>
                                        <p style={{ marginTop: "-15px", fontSize: "10px" }}>{course.category}</p>
                                    </div>
                                    <div className="d-flex pt-4 col-1">
                                        <Tooltip title="Edit">
                                            <EditOutlined className="h5 pointer text-warning p-2" />
                                        </Tooltip>
                                        <Tooltip title="Publish">
                                            <CheckOutlined className="h5 pointer text-danger p-2" />
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr />
                        <div className="row">
                            <div className="col"><ReactMarkdown children={course.description} /></div>
                        </div>

                    </div>
                )}
            </div>
        </InstructorRoute>
    );
}

export default CourseViewById;