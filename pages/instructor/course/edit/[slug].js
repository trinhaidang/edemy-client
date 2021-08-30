
import { useEffect, useState } from "react";
import { DEFAULT_PRICE } from "../../../../common/constants";
import CourseCreateForm from "../../../../components/forms/CourseCreateForm";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import Resizer from 'react-image-file-resizer';
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { List, Avatar } from "antd";

const API_UPLOAD_IMAGE = "/api/course/upload-image";
const API_REMOVE_IMAGE = "/api/course/remove-image";
const API_COURSE = "/api/course";
const API_GET_COURSE_BY_SLUG = "/api/course";

const {Item} = List;

const CourseEdit = () => {
    const router = useRouter();
    const { slug } = router.query;
    const [values, setValues] = useState({
        name: '',
        description: '',
        paid: true,
        price: DEFAULT_PRICE,
        uploading: false,
        category: '',
        loading: false,
        lessons: [],
    });
    const [preview, setPreview] = useState("");
    const [uploadButtonText, setUploadButtonText] = useState("Upload Image");
    const [image, setImage] = useState({});

    useEffect(() => {
        if(!router.isReady) return;
        loadCourse();
    }, [router.isReady]);
    
    const loadCourse = async () => {
        const { data } = await axios.get(`${API_GET_COURSE_BY_SLUG}/${slug}`);
        console.log(data);
        console.log(slug);
        if(data.course) setValues(data.course);
        if (data.course && data.course.image) setImage(data.course.image);
    }

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
                const { data } = await axios.post(API_UPLOAD_IMAGE, { image: uri });
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
            toast(err.response.data);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        saveCourse();
    }

    const saveCourse = async () => {
        try {
            const { data } = await axios.put(`${API_COURSE}/${slug}`, { ...values, image });
            toast("Course Updated");
            console.log(data);
            if(data) setValues(data);
            if (data && data.image) setImage(data.image);
            // router.push("/instructor");
        } catch (err) {
            console.log(err);
            toast("Course Update failed. Try again");
        }
    }

    const handleDrag = (e, index) => {
        // console.log("DRAG: ", index);
        e.dataTransfer.setData('itemIndex', index);
    };
    const handleDrop = async (e, index) => {
        // console.log("DROP: ", index);
        const movingItemIndex = e.dataTransfer.getData("itemIndex");
        const targetItemIndex = index;
        let allLessons = values.lessons;
        let movingItem = allLessons[movingItemIndex]; 
        allLessons.splice(movingItemIndex, 1); // remove 1 item at start index
        allLessons.splice(targetItemIndex, 0, movingItem); // push movingItem after drop index

        setValues({...values, lessons: [...allLessons]});
        saveCourse();
        
    };

    return (
        <InstructorRoute>
            <h1 className="jumbotron text-center square">Update Course</h1>
            {/* <pre>{JSON.stringify(values, null, 4)}</pre> */}
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
                    editPage={true}
                />
            </div>

            <hr />
            <div className="row py-5">
                <div className="col lesson-list">
                    <h4>
                        {values && values.lessons && values.lessons.length} Lessons
                    </h4>
                    <List onDragOver={(e) => e.preventDefault()}
                        itemLayout="horizontal" dataSource={values && values.lessons} renderItem={(item, index) => (
                        <Item draggable onDragStart={e => handleDrag(e, index)} onDrop={e => handleDrop(e, index)}>
                            <Item.Meta avatar={<Avatar >{index + 1}</Avatar>} title={item.title}
                            ></Item.Meta>
                        </Item>
                    )}></List>
                </div>
            </div>

        </InstructorRoute>
    );
}

export default CourseEdit;