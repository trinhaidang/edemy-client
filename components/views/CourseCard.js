import {Card, Badge} from "antd";
import Link from "next/link";
import { DEFAULT_COURSE_IMG, DEFAULT_CURRENCY } from "../../common/constants";
import { currencyFormatter } from "../../common/utils";

const {Meta} = Card;

const CourseCard = ({course}) => {
    // console.log("COURSE CARD: ", course);
    return (
        <Link href={`/course/${course.slug}`}>
            <a>
                <Card className="mt-4" cover={<img src={course.image.Location || DEFAULT_COURSE_IMG} alt={course.name} style={{height: "200px", objectFit: "cover"}} 
                    />} 
                >
                    <h2 className="font-weight-bold">{course.name}</h2>
                    <p>by {course.instructor.name}</p>
                    <Badge count={course.category} style={{backgroundColor: "#03a9f4"}} className="pb-2 mr-2" />
                    <h4 className="pt-2">{course.paid ? currencyFormatter({
                        amount: course.price,
                        currency: course.currency || DEFAULT_CURRENCY
                    }) : "FREE"}</h4>
                </Card>
            </a>
        </Link>
    )
};

export default CourseCard;



