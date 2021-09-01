import {Card, Badge} from "antd";
import Link from "next/link";
import { DEFAULT_COURSE_IMG } from "../../common/constants";

const {Meta} = Card;

const CourseCard = ({course}) => {
    return (
        <Link href={`/course/${course.slug}`}>
            <a>
                <Card className="mt-4" cover={<img src={course.image.Location || DEFAULT_COURSE_IMG} alt={name} style={{height: "200px", objectFit: "cover"}} 
                    />} 
                >
                    <h2 className="font-weight-bold">{course.name}</h2>
                    <p>by {course.instructor.name}</p>
                    <Badge count={course.category} style={{backgroundColor: "#03a9f4"}} className="pb-2 mr-2" />
                    <h4 className="pt-2">{course.paid ? course.price+".000 VND" : "FREE"}</h4>
                </Card>
            </a>
        </Link>
    )
};

export default CourseCard;



