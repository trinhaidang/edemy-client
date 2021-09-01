import axios from "axios";
import { useEffect, useState } from "react";
import CourseCard from "../components/views/CourseCard";

const API_ALL_PUBLISHED_COURSES = "/api/courses";

const Index = () => {

    const [courses, setCourses] = useState([]);
    const fetchCourses = async () => {
        const {data} = await axios.get(API_ALL_PUBLISHED_COURSES);
        setCourses(data);
    };
    useEffect(() => {
        fetchCourses(); 
    }, []);

    return (
        <>
            <h1 className="jumbotron text-center bg-primary square">
                Vietcourse.com
            </h1>
            <div className="container-fluid">
                <div className="row">
                    {courses.map((course) => (
                        <div key={course._id} className="col-lg-4 col-md-6">
                            <CourseCard course={course} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Index;