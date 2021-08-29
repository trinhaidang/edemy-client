import { Menu } from "antd";
import Link from "next/link";
// import Link from "@material-ui/core/Link";
import { AppstoreOutlined, CarryOutOutlined, CoffeeOutlined, LoginOutlined, LogoutOutlined, TeamOutlined, UserAddOutlined } from "@ant-design/icons";
import { useEffect, useState, useContext } from "react";
import { Context } from "../context";
import { ActionEnum, RoleEnum } from "../common/constants";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const API_LOGOUT = "/api/logout";

const { Item, SubMenu, ItemGroup } = Menu;

const TopNav = () => {

    const [current, setCurrent] = useState("");
    const { state, dispatch } = useContext(Context);
    const { user } = state;

    const router = useRouter();
    useEffect(() => {
        process.browser && setCurrent(window.location.pathname);
    }, [process.browser && window.location.pathname]);

    // logout
    const logout = async () => {
        // remove from context
        dispatch({ type: ActionEnum.LOGOUT });
        // remove from local storage
        window.localStorage.removeItem("user");
        const { data } = await axios.get(API_LOGOUT);
        toast(data.message);
        router.push("/login");
    };

    return (
        <Menu mode="horizontal" selectedKeys={[current]} className="mb-2">
            <Item key="/" onClick={(e) => setCurrent(e.key)} icon={<AppstoreOutlined />}>
                <Link href="/">
                    <a>App</a>
                </Link>
            </Item>

            {user && user.role && user.role.includes(RoleEnum.INSTRUCTOR)
                ? (
                    <>
                        <Item key="/instructor/course/create" onClick={(e) => setCurrent(e.key)} icon={<CarryOutOutlined />}>
                            <Link href="/instructor/course/create">
                                <a>Create Course</a>
                            </Link>
                        </Item>
                        <Item key="/instructor" onClick={(e) => setCurrent(e.key)} icon={<TeamOutlined />} >
                            <Link href="/instructor">
                                <a>Instructor Dashboard</a>
                            </Link>
                        </Item>
                    </>
                )
                : (
                    <>
                        <Item key="/user/become-instructor" onClick={(e) => setCurrent(e.key)} icon={<TeamOutlined />}>
                            <Link href="/user/become-instructor">
                                <a>Become Instructor</a>
                            </Link>
                        </Item>
                    </>
                )
            }

            {/* {user && user.role && user.role.includes(RoleEnum.INSTRUCTOR) &&
                <>
                    <Item key="/instructor" onClick={(e) => setCurrent(e.key)} icon={<CarryOutOutlined />}>
                        <Link href="/instructor">
                            <a>Instructor Dashboard</a>
                        </Link>
                    </Item>
                </>
            } */}

            {user === null && (
                <>
                    <Item key="/login" onClick={(e) => setCurrent(e.key)} icon={<LoginOutlined />}>
                        <Link href="/login">
                            <a>Login</a>
                        </Link>
                    </Item>
                    <Item key="/register" onClick={(e) => setCurrent(e.key)} icon={<UserAddOutlined />}>
                        <Link href="/register">
                            <a>Register</a>
                        </Link>
                    </Item>
                </>
            )}
            {user !== null && (
                <SubMenu icon={<CoffeeOutlined />} title={user && user.name} className="ms-auto">
                    <ItemGroup>
                        <Item key="/user">
                            <Link href="/user">
                                <a>Dashboard</a>
                            </Link>
                        </Item>
                        <Item key="#" onClick={logout}>
                            Log out
                        </Item>
                    </ItemGroup>
                </SubMenu>
            )}
        </Menu>
    );
};

export default TopNav;