import axios from "axios";
import { Avatar, Tooltip } from "antd";
import { DEFAULT_COURSE_IMG, RefModeEnum } from "../../../../../common/constants";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import InstructorRoute from "../../../../../components/routes/InstructorRoute";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import CourseView from "../../../../../components/views/CourseView";

const API_GET_COURSE_BY_ID = "/api/course/id/";

const CourseViewById = () => {

    const [course, setCourse] = useState([]);
    const router = useRouter();
    const { _id: id } = router.query;

    useEffect(() => {
        if(!router.isReady) return;
        loadCourse();
    }, [router.isReady]);

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
                    <CourseView
                        course={course} 
                        setCourse={setCourse} 
                        refMode={RefModeEnum.ID} 
                    />
                )}
            </div>
        </InstructorRoute>
    );
}

export default CourseViewById;