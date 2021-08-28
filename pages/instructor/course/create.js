
import { useState } from "react";
import { DEFAULT_PRICE } from "../../../common/constants";
import CourseCreateForm from "../../../components/forms/CourseCreateForm";
import InstructorRoute from "../../../components/routes/InstructorRoute";



const CourseCreate = () => {
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: DEFAULT_PRICE,
        uploading: false,
        paid: true,
        category: '',
        loading: false,
        imagePreview: ''
    });

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };
    const handleImage = () => { };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(values);
    }

    return (
        <InstructorRoute>
            <h1 className="jumbotron text-center square">Create Course</h1>
            <div className="pt-3 pb-3">
                <CourseCreateForm 
                    handleSubmit={handleSubmit} 
                    handleChange={handleChange} 
                    handleImage={handleImage} 
                    values={values} 
                    setValues={setValues}
                />
            </div>
            <pre>{JSON.stringify(values, null, 4)}</pre>
        </InstructorRoute>
    );
}

export default CourseCreate;