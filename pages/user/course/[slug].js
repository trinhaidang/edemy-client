import { Avatar, Button, Menu } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { createElement, useEffect, useState } from "react";
import { toast } from "react-toastify";
import StudentRoute from "../../../components/routes/StudentRoute";
import ReactMarkdown from "react-markdown";
import { getFileExtension } from "../../../common/utils";
import ReactPlayer from "react-player";
import { CheckCircleFilled, MenuFoldOutlined, MenuUnfoldOutlined, MinusCircleFilled } from "@ant-design/icons";

const API_USER_COURSE = "/api/user/course";
const API_MARK_COMPLETED = "/api/mark-completed";
const API_MARK_INCOMPLETED = "/api/mark-incompleted";
const API_LIST_COMPLETED = "/api/list-completed";
const { Item } = Menu;

const UserSingleCourse = () => {

    const router = useRouter();
    const [clicked, setClicked] = useState(0);
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState({ lessons: [] });
    const { slug } = router.query;

    useEffect(() => {
        if (slug) loadCourse();
    }, [slug]);
    const loadCourse = async () => {
        try {
            const { data } = await axios.get(`${API_USER_COURSE}/${slug}`);
            console.log(data.course);
            setCourse(data.course);
        } catch (err) {
            console.log(err);
            toast("Load Course failed. Try again");
        }
    }

    // completed
    const [completedLessons, setCompletedLessons] = useState([]);
    const [updateState, setUpdateState] = useState(false);
    useEffect(() => {
        if (course) loadCompletedLessons();
    }, [course]);
    const markCompleted = async () => {
        // console.log('SEND THIS LESSON ID TO MARK AS COMPLETED: ', clicked);
        try {
            const { data } = await axios.post(API_MARK_COMPLETED, {
                courseId: course._id,
                lessonId: course.lessons[clicked]._id
            });
            // console.log("markCompleted: ", data);
            // loadCompletedLessons();

            // instead of calling loadCompletedLessons
            setCompletedLessons([...completedLessons, course.lessons[clicked]._id]);
        } catch (err) {
            console.log(err);
            toast("Mark as completed failed. Try again.")
        }
    };
    const markIncompleted = async () => {
        // console.log('SEND THIS LESSON ID TO MARK AS INCOMPLETED: ', clicked);
        try {
            const { data } = await axios.post(API_MARK_INCOMPLETED, {
                courseId: course._id,
                lessonId: course.lessons[clicked]._id
            });
            // console.log("markIncompleted: ", data);
            // loadCompletedLessons();

            // instead of calling loadCompletedLessons
            const index = completedLessons.indexOf(course.lessons[clicked]._id);
            if(index > -1) {
                completedLessons.splice(index, 1);
            };
            setUpdateState(!updateState);
        } catch (err) {
            console.log(err);
            toast("Mark as incompleted failed. Try again.")
        }
    };
    const loadCompletedLessons = async () => {
        try {
            const { data } = await axios.post(API_LIST_COMPLETED, { courseId: course._id });
            // console.log("loadCompletedLessons: ",data);
            setCompletedLessons(data);
        } catch (err) {
            console.log(err);
            toast("Load completed lessons failed. Try again.")
        }
    }

    return (
        <StudentRoute>
            {/* <pre>{JSON.stringify(course, null, 4)}</pre > */}
            {/* <div className="container-xs-fluid"> */}
            <div className="row">
                <div className="col" style={{ maxWidth: 320, backgroundColor: "red" }}>
                    <Button
                        className="text-primary mt-1 mb-2"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)} {!collapsed && " Lessons"}
                    </Button>
                    <Menu defaultSelectedKeys={clicked} inlineCollapsed={collapsed} style={{ height: "80vh", overflow: "scroll" }}>
                        {course.lessons && course.lessons.map((lesson, index) => (
                            <Item key={index} icon={<Avatar>{index + 1}</Avatar>} onClick={() => setClicked(index)}>
                                {lesson.title.substring(0, 30)}
                                {completedLessons.includes(lesson._id)
                                    ? (<CheckCircleFilled className="float-end text-primary ms-2" style={{ marginTop: "13px" }} />)
                                    : (<MinusCircleFilled className="float-end text-danger ms-2" style={{ marginTop: "13px" }} />)}
                            </Item>
                        ))}
                    </Menu>
                </div>
                <div className="col">
                    {course.lessons[clicked] && (
                        <>
                            <div className="col alert alert-primary square">
                                <b>{course.lessons[clicked].title.substring(0, 30)}</b>
                                {completedLessons.includes(course.lessons[clicked]._id)
                                    ? (
                                        <span className="float-end pointer" onClick={markIncompleted}>
                                            Mark as incompleted
                                        </span>
                                    )
                                    : (
                                        <span className="float-end pointer" onClick={markCompleted}>
                                            Mark as completed
                                        </span>
                                    )}
                            </div>
                            {course.lessons[clicked].media && course.lessons[clicked].media.Location
                                && (getFileExtension(course.lessons[0].media.Key) === "pdf"
                                    ? (<div>
                                        <a href={course.lessons[clicked].media.Location} target="_blank">PDF FILE</a>
                                    </div>)
                                    : (<>
                                        <div className="wrapper" onEnded={() => markCompleted()}>
                                            <ReactPlayer className="player" url={course.lessons[clicked].media.Location} width="100%" height="100%" controls />
                                        </div>
                                    </>)
                                )}
                            <ReactMarkdown children={course.lessons[clicked].content} className="single-post" />
                        </>
                    )}
                </div>
            </div>
            {/* </div> */}
        </StudentRoute>
    );
}


export default UserSingleCourse;