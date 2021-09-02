import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import StudentRoute from "../../../components/routes/StudentRoute";

const API_USER_COURSE = "/api/user/course"

const UserSingleCourse = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState({ lessons: [] });
    const { slug } = router.query;

    useEffect(() => {
        if (slug) loadCourse();
    }, [slug]);
    const loadCourse = async () => {
        try {
            const { data } = await axios.get(`${API_USER_COURSE}/${slug}`);
            setCourse(data);
        } catch (err) {
            console.log(err);
            toast("Load Course failed. Try again");
        }
    }

    return (
        <StudentRoute>
            <pre>{JSON.stringify(course, null, 4)}</pre >
        </StudentRoute>
    );
}


export default UserSingleCourse;