import { useState, useEffect } from 'react';
import { dbService } from 'fbase';
import "css/Home.css"
import { Table, Tag, Select } from 'antd';
import 'antd/dist/antd.css';

const { Option } = Select;

const Home = ({ userObj }) => {
    const [data, setData] = useState();
    const [device, setDevice] = useState(1);
    const [dataSelect, setDataSelect] = useState();


    useEffect(() => {
        dbService.collection("RealTime").onSnapshot((snapshot) => {
            const newArray = snapshot.docs.map((document) => {
                return {
                    id: document.id,
                    key: document.id,
                    device: `devcie# ${document.data().device}`,
                    datetime: document.data().datetime.toDate().toLocaleString('ko-KR',),
                    status: [document.data().alarmA, document.data().alarmB, document.data().alarmC]
                }
            });
            setData(newArray);
        });
    }, []);

    useEffect(() => {
        const unsubscribe = dbService.collection("RealTimeAlarm").where("device", "==", device).orderBy("channel", "asc").onSnapshot((snapshot) => {
            const newArray = snapshot.docs.map((document) => {
                return {
                    id: document.id,
                    key: document.id,
                    Phase: String.fromCharCode(64 + document.data().channel),
                    datetime: document.data().datetime.toDate().toLocaleString('ko-KR',),
                }
            });
            setDataSelect(newArray);
        });
        return () => {
            unsubscribe();
        };
    }, [device]);



    const columns = [{
        title: '장비명',
        dataIndex: 'device',
        key: 'device',
    },
    {
        title: '업데이트 시간',
        dataIndex: 'datetime',
        key: 'datetime',
    },
    {
        title: '알람 상태',
        dataIndex: 'status',
        key: 'status',
        render: tags => (
            <>
                {tags.map((v, i) => <Tag key={i} color={(v === 0) ? 'green' : 'red'}>{String.fromCharCode(65 + i)}</Tag>)}
            </>
        )
    },
    ]

    const columnsSelect = [{
        title: 'Phase',
        dataIndex: 'Phase',
        key: 'Phase',
        render: tag => (
            <Tag color={'red'}>{tag}</Tag>
        )
    },
    {
        title: '알람발생 시간',
        dataIndex: 'datetime',
        key: 'datetime',
    },
    ]



    const deviceChange = (e) => {

        setDevice(parseInt(e))
    }

    return (
        <>
            <Table columns={columns} dataSource={data} pagination={false} />
            <Select name="device" value={device.toString()} onChange={deviceChange} className="select">
                <Option value="1">Device#1</Option>
                <Option value="2">Device#2</Option>
                <Option value="3">Device#3</Option>
            </Select>
            <Table columns={columnsSelect} dataSource={dataSelect} pagination={false} />
        </>
    )
}

export default Home
