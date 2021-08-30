import Link from "next/link";
import { useEffect, useState } from "react";



const UserNav = () => {

    const [current, setCurrent] = useState("");
    useEffect(() => {
        process.browser && setCurrent(window.location.pathname);
    }, [process.browser && window.location.pathname]);

    return (
        <div className="side-nav nav flex-column nav-pills">
            <Link href="/user">
                <a className={`nav-link ${current === "/user" && "active"}`}>My Learning</a>
            </Link>
        </div>
    );
};

export default UserNav;