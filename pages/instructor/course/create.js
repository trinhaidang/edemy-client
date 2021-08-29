
import { useState } from "react";
import { DEFAULT_PRICE } from "../../../common/constants";
import CourseCreateForm from "../../../components/forms/CourseCreateForm";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import Resizer from 'react-image-file-resizer';
import axios from "axios";
import { toast } from "react-toastify";

const API_UPLOAD_IMAGE="/api/course/upload-image";
const API_REMOVE_IMAGE="/api/course/remove-image";

const CourseCreate = () => {
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: DEFAULT_PRICE,
        uploading: false,
        paid: true,
        category: '',
        loading: false,
    });
    const [preview, setPreview] = useState("");
    const [uploadButtonText, setUploadButtonText] = useState("Upload Image");
    const [image, setImage] = useState({});

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };
    const handleImage = (e) => { 
        let file = e.target.files[0];
        setPreview(window.URL.createObjectURL(file));
        setUploadButtonText(file.name);
        setValues({ ...values, loading: true });

        // resize
        Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
            try {
                const {data} = await axios.post(API_UPLOAD_IMAGE, {image: uri});
                console.log("IMAGE UPLOADED: ", data);
                setImage(data);
                setValues({ ...values, loading: false });
            } catch (err) {
                console.log(err);
                setValues({ ...values, loading: false });
                TransformStream("Image upload failed. Try again.");
            }
        })
    };
    const handleImageRemove = async (e) => {
        try {
            setValues({ ...values, loading: true });
            const res = await axios.post(API_REMOVE_IMAGE, { image });
            setImage({});
            setPreview("");
            setUploadButtonText("Upload Image");
            setValues({ ...values, loading: false });
        } catch (err) {
            console.log(err);
            setValues({ ...values, loading: false });
            toast("Image upload failed. Try again");
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(values);
        console.log(preview);
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
                    preview={preview}
                    uploadButtonText={uploadButtonText}
                    handleImageRemove={handleImageRemove}
                />
            </div>
            <pre>{JSON.stringify(values, null, 4)}</pre>
            <hr />
            <pre>{JSON.stringify(image, null, 4)}</pre>

        </InstructorRoute>
    );
}

export default CourseCreate;