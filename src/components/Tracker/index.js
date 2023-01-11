import { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Menu, Input, Card, Col, Row, Select, Button } from "antd";
import {
    AreaChartOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import styles from "./index.module.css"
import { Area } from "@ant-design/charts";
import stockData from "../../stocksdata/us-stock-symbols.json"


function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const LineChart = (props) => {
    const { fetchData } = props;
    const [data, setData] = useState([]);
    useEffect(() => {
        setData(fetchData)
    }, [fetchData])

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
    let apikey = process.env.REACT_APP_Finnhub_API_KEY;
    const yesterdayInSec = parseFloat(Date.now() / 1000).toFixed(0);
    const dayInSec = 86400;
    const initStartTime = yesterdayInSec - (7 * dayInSec);
    const [symbol, setSymbol] = useState("VTI")
    const [singleSymbol, setSingleSymbol] = useState({})
    const [resolution, setResolution] = useState("D")
    const [endTo, setEndTo] = useState(yesterdayInSec)
    const [startFrom, setStartFrom] = useState(initStartTime)
    const [fetchData, setFetchData] = useState([])
    const [searchList, setsearchList] = useState([])
    const { Sider, Content } = Layout;
    const [searchValue, setSearchValue] = useState('')
    const { Search } = Input;
    const onSearch = (value) => {
        setSymbol(value)
        setSearchValue("")
    };

    const onChange = (value) => {
        setStartFrom(yesterdayInSec - (value * dayInSec))
    };

    const searchfunction = (value) => {
        setSearchValue(value)
        setsearchList(stockData.filter((item) => item.includes(value.toUpperCase())).slice(0, 12))
    }
    const increase = (value, percent) => {
        if (value === 0) {
            return value + `(${percent}%)`
        }
        if (value > 0) {
            return "+" + value + `(+${percent}%)`
        } else {
            return value + `(${percent}%)`
        }
    }

    const items = [
        getItem('面積圖', '1', <AreaChartOutlined />),
        // getItem('K線', '2', <DesktopOutlined />),

    ];

    useEffect(() => {
        const fetchSingleSymbol = async () => {
            const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apikey}`);
            setSingleSymbol(response.data)
        }
        const fetchDatas = async () => {
            try {
                await axios.get(
                    `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${startFrom}&to=${endTo}&token=${apikey}`
                ).then((res) => {
                    const price = res.data.c;
                    const date = res.data.t;
                    const merged = price.map((el, index) => [el, date[index]]).map((item) => {
                        return { "date": new Date(item[1] * 1000).toLocaleDateString("en-US"), "price": item[0] }
                    })
                    setFetchData(merged)
                })
            } finally {

            }
        }



        fetchSingleSymbol();
        fetchDatas();
    }, [symbol, resolution, startFrom, endTo])


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


                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />

            </Sider>
            <Content style={{
                margin: '24px 16px',
            }} >
                <div className="relative">
                    <Input.Group compact style={{ display: 'flex' }} className=" w-2/3">
                        <Input
                            className="w-full"
                            placeholder="search" onChange={(e) => searchfunction(e.target.value)}
                        />
                        <Button className=" bg-slate-300" onClick={() => onSearch(searchValue)}>搜尋</Button>
                    </Input.Group>
                    {/* <Search placeholder="股票代碼" onSearch={onSearch} enterButton="搜尋" size="large" className="rounded-lg w-2/3 bg-blue-700 hover:bg-blue-500 " /> */}
                    {searchValue && <div className=" absolute z-50 w-3/5">
                        {
                            searchList.map((item) => {
                                return (
                                    <div className=" bg-gray-300 h-10 flex items-center rounded-b ml-2 p-2">
                                        <span className=" text-gray-800 font-semibold text-xl">{item}</span>
                                    </div>
                                )
                            })
                        }

                    </div>}
                </div>


                <h3 className="text-3xl my-2 font-bold">{symbol}</h3>
                <div className="">
                    <Row gutter={16} wrap >
                        <Col xs={24} md={8}>
                            <Card title={increase(singleSymbol.d, singleSymbol.dp)} bordered={false} >
                                <p className=" text-xl whitespace-pre-wrap md:text-2xl" style={(singleSymbol.d > 0) ? { color: "green" } : { color: "red" }}>{singleSymbol.c} <span className=" text-sm font-semibold">USD</span></p>
                            </Card>
                        </Col>
                        <Col xs={24} md={8} className="pt-2 md:p-0">
                            <Select
                                style={{ width: '60%' }}
                                placeholder="選擇時間軸"
                                optionFilterProp="children"
                                onChange={onChange}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={[
                                    {
                                        value: 7,
                                        label: '7天',
                                    },
                                    {
                                        value: 30,
                                        label: '30天',
                                    },
                                    {
                                        value: 180,
                                        label: '半年'
                                    },
                                    {
                                        value: 365,
                                        label: '一年'
                                    }
                                ]}
                            />
                        </Col>
                    </Row>

                </div>
                <div className=" p-2">
                    <LineChart fetchData={fetchData} />
                </div>


            </Content>


        </Layout>
    )

}

export default Tracker;