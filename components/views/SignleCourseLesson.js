import { Avatar, List } from "antd"
import { getFileExtension } from "../../common/utils";

const {Item} = List;

const SingleCourseLesson = ({lessons, setPreview, showModal, setShowModal}) => {
    return (
        <div className="container p-3">
            <div className="row">
                <div className="col lesson-list">
                    {lessons && <h4>{lessons.length} Lessons</h4>}
                    <hr />
                    <List 
                        itemLayout="horizontal" dataSource={lessons}
                        renderItem={(item, index) => (
                            <Item>
                                <Item.Meta avatar={<Avatar>{index + 1}</Avatar>} title={item.title} />
                                    { item.media && item.free_preview &&
                                        (getFileExtension(item.media.Key) === "pdf"
                                            ? ( <div>
                                                    <a href={item.media.Location} target="_blank">PDF FILE</a>
                                                </div>)
                                            : ( <span className="text-primary pointer" onClick={() => {
                                                    setPreview(item.media.Location);
                                                    setShowModal(!showModal);
                                                }}><a>preview</a></span>)
                                        )
                                    }
                            </Item>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export default SingleCourseLesson;