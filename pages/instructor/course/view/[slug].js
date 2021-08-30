import axios from "axios";
import { Avatar, Button, Modal, Tooltip } from "antd";
import { DEFAULT_COURSE_IMG } from "../../../../common/constants";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import { CheckOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import AddLessonForm from "../../../../components/forms/AddLessonForm";
import CourseView from "../../../../components/views/CourseView";


const API_GET_COURSE_BY_SLUG = "/api/course/";
const API_LESSON = "/api/course/lesson";

const CourseViewBySlug = () => {

    const [course, setCourse] = useState([]);
    const router = useRouter();
    const {slug} = router.query;

    useEffect(() => {
        loadCourse();
    },[slug]);

    const loadCourse = async () => {
        const {data} = await axios.get(`${API_GET_COURSE_BY_SLUG}${slug}`);
        setCourse(data.course);
    } 

    return (
        <InstructorRoute>
            {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
            <div className="container-fluid pt-3">
                {course && (
                    <CourseView 
                        course={course} 
                        setCourse={setCourse} 
                        findBy={course.slug} 
                        apiLesson={API_LESSON} 
                    />
                
                    // <div className="container-fluid pt-1">

                    //     <div className="media pt-2 row">
                    //         <Avatar size={80} src={course.image ? course.image.Location : DEFAULT_COURSE_IMG} className="col-3"/>
                    //         <div className="media-body col-9">
                    //             <div className="row">
                    //                 <div className="col-11">
                    //                     <h5 className="mt-2 text-primary">{course.name}</h5>
                    //                     <p style={{ marginTop: "-10px" }}>{course.lessons && course.lessons.length} Lessons</p>
                    //                     <p style={{ marginTop: "-15px", fontSize: "10px" }}>{course.category}</p>
                    //                 </div>
                    //                 <div className="d-flex pt-4 col-1">
                    //                     <Tooltip title="Edit">
                    //                         <EditOutlined className="h5 pointer text-warning p-2" />
                    //                     </Tooltip>
                    //                     <Tooltip title="Publish">
                    //                         <CheckOutlined className="h5 pointer text-danger p-2" />
                    //                     </Tooltip>
                    //                 </div>
                    //             </div>
                    //         </div>
                    //     </div>

                    //     <hr />
                    //     <div className="row">
                    //         <div className="col"><ReactMarkdown children={course.description} /></div>
                    //     </div>

                    //     <div className="row">
                    //         <Button 
                    //             className="col-md-6 offset-md-3 text-center" 
                    //             type="primary" shape="round" size="large" icon={<UploadOutlined />}
                    //             onClick={() => setVisible(true)}
                    //         >Add Lesson</Button>
                    //     </div><br />

                    //     <Modal title="+ Add Lesson" centered visible={visible} onCancel={() => setVisible(false)} footer={null}>
                    //         <AddLessonForm />
                    //     </Modal>

                    // </div>
                )}
            </div>
        </InstructorRoute>
    );
}

export default CourseViewBySlug;