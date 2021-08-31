import axios from "axios";
import { Avatar, Button, Modal, Tooltip } from "antd";
import { DEFAULT_COURSE_IMG, RefModeEnum } from "../../../../common/constants";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import { CheckOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import AddLessonForm from "../../../../components/forms/AddLessonForm";
import CourseView from "../../../../components/views/CourseView";


const API_GET_COURSE_BY_SLUG = "/api/course";

const CourseViewBySlug = () => {

    const [course, setCourse] = useState([]);
    const router = useRouter();
    const {slug} = router.query;

    useEffect(() => {
        if(!router.isReady) return;
        loadCourse();
    }, [router.isReady]);

    const loadCourse = async () => {
        const {data} = await axios.get(`${API_GET_COURSE_BY_SLUG}/${slug}`);
        setCourse(data.course);
        console.log(course);
    } 

    return (
        <InstructorRoute>
            {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
            <div className="container-fluid pt-3">
                {course && (
                    <CourseView 
                        course={course} 
                        setCourse={setCourse} 
                        refMode={RefModeEnum.SLUG} 
                    />
                )}
            </div>
        </InstructorRoute>
    );
}

export default CourseViewBySlug;