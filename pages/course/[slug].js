import { Badge, Modal } from "antd";
import axios from "axios";
import { useRouter } from "next/router"
import React, { useContext, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import { DEFAULT_COURSE_IMG, DEFAULT_CURRENCY } from "../../common/constants";
import { currencyFormatter, getFileExtension } from "../../common/utils";
import PreviewModal from "../../components/modals/PreviewModal";
import SingleCourseLesson from "../../components/views/SignleCourseLesson";
import SingleCourseJumbotron from "../../components/views/SingleCourseJumbotron";
import {Context} from "../../context";

const API_CHECK_ENROLLMENT = "/api/check-enrollment";
const API_FREE_ENROLLMENT = "/api/free-enrollment";

const SingleCourse = ({ course }) => {
    const router = useRouter();
    const { slug } = router.query;
    const [showModal, setShowModal] = useState(false);
    const [preview, setPreview] = useState("");

    // for enrollment
    const {state: {user}} = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [enrolled, setEnrolled] = useState({});
    useEffect(() => {
        if(user && course) checkEnrollment();
    }, [user, course]);
    const checkEnrollment = async () => {
        try {
            const {data} = await axios.get(`${API_CHECK_ENROLLMENT}/${course._id}`);
            console.log("CHECK ENROLLMENT: ", data);
            setEnrolled(data);
        } catch (err) {
            console.log(err);
            toast("check enrollment failed.");
        }
    }
    const handlePaidEnrollment = () => {
        console.log("handlePaidEnrollment")
    };
    const handleFreeEnrollment = async (e) => {
        // console.log("handleFreeEnrollment");
        e.preventDefault();
        try {
            // check if logged in
            if(!user) router.push("/login");
            // check if enrolled
            if(enrolled.status) {
                return router.push(`/user/course/${enrolled.course.slug}`);
            }
            setLoading(true);
            const {data} = await axios.post(`${API_FREE_ENROLLMENT}/${course._id}`);
            toast(data.message);
            setLoading(false);
            router.push(`/user/course/${data.course.slug}`);
        } catch (err) {
            setLoading(false);
            console.log(err);
            toast("enroll failed. Try again");
        }
    };

    return (
        <>
            {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
            <SingleCourseJumbotron 
                course={course}
                showModal={showModal}
                setShowModal={setShowModal}
                preview={preview}
                setPreview={setPreview}
                user={user}
                loading={loading}
                handlePaidEnrollment={handlePaidEnrollment}
                handleFreeEnrollment={handleFreeEnrollment}
                enrolled={enrolled}
                setEnrolled={setEnrolled}
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