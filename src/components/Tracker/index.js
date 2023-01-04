import { useState, useEffect } from "react";
import axios from "axios";
import { Layout, theme, Menu, Input } from "antd";
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import styles from "./index.module.css"
import { Area } from "@ant-design/charts";

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}


const LineChart = (props) => {
    const { fetchInput } = props;
    let apikey = process.env.REACT_APP_Finnhub_API_KEY;
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(
                `https://finnhub.io/api/v1/stock/candle?symbol=${fetchInput.symbol}&resolution=${fetchInput.resolution}&from=${fetchInput.from}&to=${fetchInput.to}&token=${apikey}`
            );
            const price = response.data.c;
            const date = response.data.t;
            const merged = price.map((el, index) => [el, date[index]]).map((item) => {
                return { "date": new Date(item[1] * 1000).toLocaleDateString("en-US"), "price": item[0] }
            })
            setData(merged)

        };

        fetchData();

    }, [fetchInput])


    const config = {
        data,
        xField: 'date',
        yField: 'price',
        xAxis: {
            range: [0, 1],
            tickCount: 30,
        },
        areaStyle: () => {
            return {
                fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
            }
        }
    }

    return (
        <>
            <Area {...config} />
        </>
    )
}



const Tracker = () => {
    const [collapsed, setCollapsed] = useState(false);

    const [fetchInput, setFetchInput] = useState({
        symbol: "AAPL",
        resolution: "D",
        from: 1632592600,
        to: new Date().getTime()
    })

    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const { Sider, Content } = Layout;
    const { Search } = Input;

    const onSearch = (value) => {
        setFetchInput({
            symbol: value,
            resolution: "D",
            from: 1632592600,
            to: new Date().getTime()
        })
    };

    const items = [
        getItem('面積圖', '1', <PieChartOutlined />),
        getItem('K線', '2', <DesktopOutlined />),

    ];


    return (
        <Layout
            className={styles.layout_wrap}
        >
            <Sider trigger={null} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div
                    style={{
                        height: "1.5rem",
                        margin: "28px",
                        display: 'flex',
                        justifyContent: 'flex-end'
                    }}
                >

                    {
                        collapsed ?
                            <MenuUnfoldOutlined style={{ color: "white", fontSize: '1.5rem' }} onClick={() => setCollapsed(!collapsed)} />
                            :
                            <MenuFoldOutlined style={{ color: "white", fontSize: '1.5rem' }} onClick={() => setCollapsed(!collapsed)} />
                    }
                </div>
                <div
                    style={{
                        height: "1.5rem",
                        margin: "28px 2px",
                        display: 'flex',
                        justifyContent: 'flex-end'
                    }}>
                    <Search placeholder="股票代碼"  onSearch={onSearch} enterButton />
                </div>


                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />

            </Sider>
            <Content style={{
                margin: '24px 16px',
            }} >

                <LineChart fetchInput={fetchInput} />


            </Content>


        </Layout>
    )

}

export default Tracker;