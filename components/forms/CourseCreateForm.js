import { Button, Select, Avatar, Badge } from "antd";
import { DEFAULT_PRICE } from "../../common/constants";

const { Option } = Select;


const CourseCreateForm = ({
    handleSubmit,
    handleChange,
    handleImage,
    values,
    setValues,
    preview,
    uploadButtonText,
    handleImageRemove = (f) => f,
    editPage = false,
}) => {

    const children = [];
    for (let i = 19; i <= 199; i += 20) {
        children.push(<Option key={i}>{i + ".000 VND"}</Option>)
    }

    return (
        <>
            {values && (
                <form onSubmit={handleSubmit} >
                    <div className="form-group">
                        <input
                            type="text" className="form-control" placeholder="Name"
                            name="name" value={values.name} onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            className="form-control" cols="7" rows="7"
                            name="description" value={values.description} onChange={handleChange}
                        ></textarea>
                    </div>
                    <div className="row">
                        <div className={values.paid ? "col-8" : ""}>
                            <div className="form-group">
                                <Select style={{ width: "100%" }}
                                    size="large"
                                    value={values.paid} onChange={v => setValues({ ...values, paid: v, price: 0 })}
                                >
                                    <Option value={true}>Paid</Option>
                                    <Option value={false}>Free</Option>
                                </Select>
                            </div>
                        </div>
                        {values.paid && (
                            <div className="col-4">
                                <div className="form-group clearfix" >
                                    <Select style={{ width: "100%" }}
                                        tokenSeparators={[,]} size="large"
                                        value={values.price + ".000 VND"}
                                        defaultValue={DEFAULT_PRICE + ".000 VND"}
                                        onChange={(v) => setValues({ ...values, price: v })}
                                    >
                                        {children}
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <input
                            type="text" className="form-control" placeholder="Category"
                            name="category" value={values.category} onChange={handleChange}
                        />
                    </div>
                    <div className="row">
                        <div className={preview || (editPage && values.image) ? "col-10" : ""}>
                            <div className="form-group">
                                <label className="btn btn-outline-secondary btn-block text-start" style={{ width: "100%" }}>
                                    {uploadButtonText}
                                    <input type="file" hidden accept="image/*" name="image" onChange={handleImage} />
                                </label>
                            </div>
                        </div>
                        {preview && (
                            <div className="col-2">
                                <div className="form-group" >
                                    <Badge count="X" onClick={handleImageRemove} className="pointer">
                                        <Avatar width={200} src={preview} />
                                    </Badge>
                                </div>
                            </div>
                        )}

                        {/* for edit */}
                        {!preview && editPage && values.image && (
                            <div className="col-2">
                            <div className="form-group" >
                                <Badge count="X" onClick={handleImageRemove} className="pointer">
                                    <Avatar width={200} src={values.image.Location} />
                                </Badge>
                            </div>
                        </div>
                        )}

                    </div>

                    <div className="row">
                        <div className="col">
                            <Button
                                className="btn btn-primary" type="primary" size="large" shape="round"
                                onClick={handleSubmit} disabled={values.loading || values.uploading} loading={values.loading}
                            >
                                {values.loading ? 'Saving...' : 'Save & Continue'}
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </>
    );
}

export default CourseCreateForm;