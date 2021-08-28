import { Button, Select } from "antd";
import { DEFAULT_PRICE } from "../../common/constants";

const { Option } = Select;

const CourseCreateForm = ({
    handleSubmit, handleChange, handleImage, values, setValues
}) => {

    const children = [];
    for (let i = 19; i <= 199; i+=20) {
        children.push(<Option key={i}>{i + ".000 VND"}</Option>)
    }

    return (
        <form onSubmit={handleSubmit}>
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
            <div className="form-row">
                <div className="col">
                    <div className="form-group">
                        <Select
                            style={{ width: "100%" }} size="large"
                            value={values.paid} onChange={v => setValues({ ...values, paid: !values.paid })}
                        >
                            <Option value={true}>Paid</Option>
                            <Option value={false}>Free</Option>
                        </Select>
                    </div>
                </div>
                {values.paid && (
                    // <div className="col">
                        <div className="form-group clearfix">
                            <Select
                                style={{ width: "100%" }} tokenSeparators={[,]} size="large"
                                defaultValue={DEFAULT_PRICE + ".000 VND"}
                                onChange={(v) => setValues({ ...values, price: v })}
                            >
                                {children}
                            </Select>
                        </div>
                    // </div>
                )}
            </div>
            <div className="form-group">
                <input
                    type="text" className="form-control" placeholder="Category"
                    name="category" value={values.category} onChange={handleChange}
                />
            </div>
            <div className="form-row">
                <div className="col">
                    <div className="form-group">
                        <label className="btn btn-outline-secondary btn-block text-start" style={{ width: "100%" }} >
                            {values.loading ? 'Uploading' : 'Image Upload'}
                            <input type="file" hidden accept="image/*" name="image" onChange={handleImage} />
                        </label>
                    </div>
                </div>
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
    );
}

export default CourseCreateForm;