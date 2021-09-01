import { CloseCircleFilled } from "@ant-design/icons";
import { Button, Tooltip, Progress, Switch } from "antd";
import ReactPlayer from "react-player";
import { PLAYER_HEIGHT, PLAYER_WIDTH } from "../../common/constants";
import { getFileExtension } from "../../common/utils";


const UpdateLessonForm = ({
    current, setCurrent,
    handleMedia,
    handleUpdateLesson,
    uploadMediaButtonText,
    progress,
    uploading,
}) => {

    return (
        <div className="container pt-3">
            <form onSubmit={handleUpdateLesson}>
                <input
                    type="text" className="form-control square" autoFocus required
                    value={current.title} onChange={(e) => setCurrent({ ...current, title: e.target.value })}
                />
                <textarea
                    className="form-control mt-3" cols="7" rows="7"
                    value={current.content} onChange={(e) => setCurrent({ ...current, content: e.target.value })}

                ></textarea>

                <div>
                    {!uploading && current.media && current.media.Location && (
                        <div className="d-flex justify-content-center pt-3">
                            {getFileExtension(current.media.Key) === "pdf"
                                ? (<a href={current.media.Location} target="_blank">PDF FILE</a>)
                                : (<ReactPlayer url={current.media.Location} width={PLAYER_WIDTH} height={PLAYER_HEIGHT} controls />
                                )}
                        </div>
                    )}
                    <Tooltip title="video or pdf file">
                        <label className="form-control btn btn-dark text-left mt-3">
                            {uploadMediaButtonText}
                            <input type="file" accept="video/*,.pdf" hidden onChange={handleMedia} />
                        </label>
                    </Tooltip>
                </div>
                {progress > 0 && (
                    <Progress className="d-flex justify-content-center pt-2" percent={progress} steps={10} />
                )}
                <div className="d-flex justify-content-center">
                    <span className="pt-3 pe-2">Free Preview</span>
                    <Switch
                        className="mt-3 ms-2" name="free_preview"
                        disabled={uploading} checked={current.free_preview}
                        onChange={v => setCurrent({ ...current, free_preview: v })}
                    />
                </div>

                <Button
                    className="form-control col mt-3" size="large" type="primary" shape="round"
                    onClick={handleUpdateLesson} loading={uploading}
                >
                    Save
                </Button>
            </form>
        </div>)
        ;
};

export default UpdateLessonForm;