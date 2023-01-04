import { useState } from "react";
import React from "react";
import { Link } from "react-router-dom"
import { Row, Col, Menu } from "antd";
import styles from "./index.module.css"
import logoImage from "../../images/logo.png"
const Navbar = () => {
    const [current, setCurrent] = useState('mail');
    const onClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };
    const items = [
        {
            label: (
                <Link className={styles.nav_link} to="/home">
                    產品
                </Link>
            ),
            key: 'home',
        },
        {
            label: (
                <Link className={styles.nav_link} to="/tracker">
                    市場
                </Link>
            ),
            key: 'tracker',
        },
    ];


    return (
        <>
            <Row className={styles.navbar}>
                <Col className={styles.logo} span={4}>
                    <img className={styles.logo_img} src={logoImage} alt="logo" />
                </Col>
                <Col span={16}>
                    <Menu className={styles.nav_link_wrapper} onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
                </Col>
                <Col span={4}></Col>
            </Row>
        </>
    )


}


export default Navbar