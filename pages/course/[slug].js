import { Badge, Modal } from "antd";
import axios from "axios";
import { useRouter } from "next/router"
import React, { useState } from "react";
import ReactPlayer from "react-player";
import { DEFAULT_COURSE_IMG, DEFAULT_CURRENCY } from "../../common/constants";
import { currencyFormatter, getFileExtension } from "../../common/utils";
import PreviewModal from "../../components/modals/PreviewModal";
import SingleCourseLesson from "../../components/views/SignleCourseLesson";
import SingleCourseJumbotron from "../../components/views/SingleCourseJumbotron";


const SingleCourse = ({ course }) => {
    const router = useRouter();
    const { slug } = router.query;
    const [showModal, setShowModal] = useState(false);
    const [preview, setPreview] = useState("");

    return (
        <>
            {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
            <SingleCourseJumbotron 
                course={course}
                showModal={showModal}
                setShowModal={setShowModal}
                preview={preview}
                setPreview={setPreview}
            />

            <PreviewModal showModal={showModal} setShowModal={setShowModal} preview={preview} />

            {course.lessons && (
                <SingleCourseLesson lessons={course.lessons} setPreview={setPreview} showModal={showModal} setShowModal={setShowModal} />
            )}
        </>
    )
};

export async function getServerSideProps({ query }) {
    try {
        const { data } = await axios.get(`${process.env.API}/course/${query.slug}`);
        return {
            props: {
                course: data.course,
            }
        }
    } catch (err) {
        console.log(err);
        toast("Could not load the course");
    }
};

export default SingleCourse;