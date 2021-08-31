
import { useEffect, useState } from "react";
import { DEFAULT_PRICE } from "../../../../common/constants";
import CourseCreateForm from "../../../../components/forms/CourseCreateForm";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import Resizer from 'react-image-file-resizer';
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { List, Avatar, Modal, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import UpdateLessonForm from "../../../../components/forms/UpdateLessonForm";

const API_UPLOAD_IMAGE = "/api/course/upload-image";
const API_REMOVE_IMAGE = "/api/course/remove-image";
const API_UPLOAD_MEDIA = "/api/course/upload-media";
const API_REMOVE_MEDIA = "/api/course/remove-media";
const API_COURSE = "/api/course";
const API_GET_COURSE_BY_SLUG = "/api/course";
const API_LESSON = "/api/course/lesson";

const { Item } = List;

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
        if (!router.isReady) return;
        loadCourse();
    }, [router.isReady]);

    const loadCourse = async () => {
        const { data } = await axios.get(`${API_GET_COURSE_BY_SLUG}/${slug}`);
        console.log(data);
        console.log(slug);
        if (data.course) setValues(data.course);
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
            if (data) setValues(data);
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

        setValues({ ...values, lessons: [...allLessons] });
        saveCourse();

    };
    const handleDelete = async (index, item) => {
        const answer = window.confirm(`Are you sure you want to delete Lesson: ${item.title}?`);
        if (!answer) return;
        try {
            let allLessons = values.lessons;
            const removed = allLessons.splice(index, 1)[0];
            // console.log("lesson to delete: ", removed);
            setValues({ ...values, lessons: allLessons });
            // saveCourse();   // --- use for save all lessons
            const { data } = await axios.put(`${API_COURSE}/${slug}/${removed._id}`);
            console.log("lesson deleted: ", data);
        } catch (err) {
            console.log(err);
            toast("Lesson delete failed. Try again.");
        }
    };

    /*
     ***** lesson update form function
    */

    const [visible, setVisible] = useState(false);    // modal display
    const [current, setCurrent] = useState({});       // current item on modal
    const [uploadMediaButtonText, setUploadMediaButtonText] = useState("Upload media");
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const handleMedia = async (e) => {
        try {
            setUploading(true);
            // remove previous media
            if (current.media && current.media.Location) {
                const removed = await axios.post(`${API_REMOVE_MEDIA}/${values.instructor._id}`, current.media);
                console.log("REMOVE MEDIA: ", removed);
            }
            // add selected media
            const file = e.target.files[0];
            setUploadMediaButtonText(file.name);
            const mediaData = new FormData();
            if (file.type === "application/pdf") {
                mediaData.append("doc", file);
            } else {
                mediaData.append("video", file);
            }
            mediaData.append("courseId", values._id);
            // send media to save
            const { data } = await axios.post(`${API_UPLOAD_MEDIA}/${values.instructor._id}`, mediaData, {
                onUploadProgress: (e) => {
                    setProgress(Math.round(100 * e.loaded) / e.total)
                }
            });
            console.log("MEDIA ADDED: ", data);
            setCurrent({ ...current, media: data });

            setUploading(false);
        } catch (err) {
            setUploading(false);
            console.log(err);
            toast("Media add failed. Try again");
        }
    };

    const handleUpdateLesson = async () => {
        // console.log("handle update lesson")
        try {
            const { data } = await axios.put(`${API_LESSON}/${slug}/${current._id}`, current);
            setUploadMediaButtonText("Upload media");
            setVisible(false);
            if(data && data.ok) {
                let arr = values.lessons
                const index = arr.findIndex((el) => el._id === current._id);
                arr[index] = current;
                setValues({...values, lessons: arr});
                toast("Lesson updated successfully!");
            }
        } catch (err) {
            console.log(err);
            toast("Lesson update failed. Try again");
        }
    }

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
                                <Item.Meta avatar={<Avatar >{index + 1}</Avatar>} title={item.title}></Item.Meta>
                                <Tooltip title="Edit">
                                    <EditOutlined className="h5 pointer text-warning pe-3" onClick={() => {
                                        setVisible(true);
                                        setCurrent(item);
                                    }} />
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <DeleteOutlined onClick={() => handleDelete(index, item)} className="text-danger float-end" style={{ marginBottom: "0.5rem" }} />
                                </Tooltip>
                            </Item>
                        )}></List>
                </div>
            </div>

            <Modal title="Update lesson" centered visible={visible} onCancel={() => setVisible(false)} footer={null}>
                <UpdateLessonForm
                    current={current}
                    setCurrent={setCurrent}
                    handleMedia={handleMedia}
                    handleUpdateLesson={handleUpdateLesson}
                    uploadMediaButtonText={uploadMediaButtonText}
                    progress={progress}
                    uploading={uploading}
                />
                {/* <pre>{JSON.stringify(current, null, 4)}</pre> */}
            </Modal>
        </InstructorRoute>
    );
}

export default CourseEdit;