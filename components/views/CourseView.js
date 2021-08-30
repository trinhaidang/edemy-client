import axios from "axios";
import { Avatar, Button, Modal, Tooltip, List } from "antd";
import { DEFAULT_COURSE_IMG } from "../../common/constants";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CheckOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import AddLessonForm from "../forms/AddLessonForm";
import { toast } from "react-toastify";
import Item from "antd/lib/list/Item";

const API_UPLOAD_MEDIA = "/api/course/upload-media/";
const API_REMOVE_MEDIA = "/api/course/remove-media/";

const CourseView = ({ course , setCourse, apiLesson, findBy}) => {

    const [visible, setVisible] = useState(false);
    const [values, setValues] = useState({
        title: "",
        content: "",
        media: {},
    });
    const [uploading, setUploading] = useState(false);
    const [uploadButtonText, setUploadButtonText] = useState("Upload media");
    const [progress, setProgress] = useState(0);

    const handleAddLesson = async (e) => {
        e.preventDefault();
        console.log(values);
        try {
            const { data } = axios.post(`${apiLesson}/${findBy}/${course.instructor._id}`, values);
            console.log("add lesson data: ", data);
            setValues({ ...values, title: "", content: "", media: {} });
            setVisible(false);
            setUploadButtonText("Upload media");
            setCourse(data);
            toast("Lesson added.");
        } catch (err) {
            console.log(err);
            toast("Lesson add failed.");
        }
    }

    const handleMedia = async (e) => {
        try {
            // console.log(course.instructor._id);
            setUploading(true);
            const file = e.target.files[0];
            setUploadButtonText(file.name);

            const mediaData = new FormData();
            if (file.type === "application/pdf") {
                mediaData.append("doc", file);
            } else {
                mediaData.append("video", file);
            }

            console.log("handle media upload: ", mediaData);
            const { data } = await axios.post(`${API_UPLOAD_MEDIA}${course.instructor._id}`, mediaData, {
                onUploadProgress: (e) => {
                    setProgress(Math.round((100 * e.loaded) / e.total));
                }
            });

            console.log("data: ", data);
            setValues({ ...values, media: data });
            setUploading(false);

        } catch (err) {
            setUploading(false);
            console.log(err);
            toast("Media upload failed. Try later");
        }
    }
    const handleMediaRemove = async () => {
        console.log("process remove media");
        try {
            setUploading(true);
            const { data } = await axios.post(`${API_REMOVE_MEDIA}${course.instructor._id}`, values.media);
            console.log(data);
            setValues({ ...values, media: {} });
            setUploadButtonText("Upload another file");

            setUploading(false);
        } catch (err) {
            setUploading(false);
            console.log(err);
            toast("Media remove failed. Try later");
        }
    }

    return (
        <div className="container-fluid pt-3">
            {course && (
                <div className="container-fluid pt-1">

                    <div className="media pt-2 row">
                        <Avatar size={80} src={course.image ? course.image.Location : DEFAULT_COURSE_IMG} className="col-3" />
                        <div className="media-body col-9">
                            <div className="row">
                                <div className="col-10">
                                    <h5 className="mt-2 text-primary">{course.name}</h5>
                                    <p style={{ marginTop: "-10px" }}>{course.lessons && course.lessons.length} Lessons</p>
                                    <p style={{ marginTop: "-15px", fontSize: "10px" }}>{course.category}</p>
                                </div>
                                <div className="d-flex pt-4 col-2">
                                    <Tooltip title="Edit">
                                        <EditOutlined className="h5 pointer text-warning p-2" />
                                    </Tooltip>
                                    <Tooltip title="Publish">
                                        <CheckOutlined className="h5 pointer text-danger p-2" />
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr />
                    <div className="row">
                        <div className="col"><ReactMarkdown children={course.description} /></div>
                    </div>

                    <hr />
                    <div className="row">
                        <Button
                            className="col-md-6 offset-md-3 text-center"
                            type="primary" shape="round" size="large" icon={<UploadOutlined />}
                            onClick={() => setVisible(true)}
                        >Add Lesson</Button>
                    </div>

                    <Modal title="+ Add Lesson" centered visible={visible} onCancel={() => setVisible(false)} footer={null}>
                        <AddLessonForm
                            values={values} setValues={setValues}
                            handleAddLesson={handleAddLesson}
                            uploading={uploading} setUploading={setUploading}
                            uploadButtonText={uploadButtonText} setUploadButtonText={setUploadButtonText}
                            handleMedia={handleMedia}
                            progress={progress}
                            handleMediaRemove={handleMediaRemove}
                        />
                    </Modal>

                    <div className="row py-5">
                        <div className="col lesson-list">
                            <h4>
                                {course && course.lessons && course.lessons.length} Lessons
                            </h4>
                            <List itemLayout="horizontal" dataSource={course && course.lessons} renderItem={(item, index) => (
                                <Item>
                                    <Item.Meta avatar={<Avatar >{index + 1}</Avatar>} title={item.title}
                                    ></Item.Meta>
                                </Item>
                            )}></List>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default CourseView;