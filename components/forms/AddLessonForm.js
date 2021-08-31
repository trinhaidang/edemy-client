import { CloseCircleFilled } from "@ant-design/icons"
import { Button, Tooltip, Progress } from "antd"


const AddLessonForm = ({
    values, setValues,
    handleAddLesson,
    uploading, 
    uploadButtonText, 
    handleMedia,
    progress,
    handleMediaRemove
}) => {

    return (
        <div className="container pt-3">
            <form onSubmit={handleAddLesson}>
                <input
                    type="text" className="form-control square" placeholder="Title" autoFocus required
                    value={values.title} onChange={(e) => setValues({ ...values, title: e.target.value })}
                />
                <textarea
                    className="form-control mt-3" cols="7" rows="7" placeholder="Content"
                    value={values.content} onChange={(e) => setValues({ ...values, content: e.target.value })}

                ></textarea>

                <div className="d-flex justify-content-center">
                    <Tooltip title="video or pdf file">
                        <label className="form-control btn btn-dark text-left mt-3">
                            {uploadButtonText}
                            <input type="file" accept="video/*,.pdf" hidden onChange={handleMedia} />
                        </label>
                    </Tooltip>
                    {!uploading && values.media.Location && (
                        <Tooltip title="Remove">
                            <span onClick={handleMediaRemove} className="pt-1 ps-3">
                                    <CloseCircleFilled className="text-danger d-flex justify-content-center pt-4 pointer" />
                            </span>
                        </Tooltip>
                    )}
                </div>
                {progress > 0 && (
                    <Progress className="d-flex justify-content-center pt-2" percent={progress} steps={10} />
                )}

                <Button
                    className="form-control col mt-3" size="large" type="primary" shape="round"
                    onClick={handleAddLesson} loading={uploading}
                >
                    Save
                </Button>
            </form>
        </div>)
        ;
};

export default AddLessonForm;