import { useState, useEffect } from 'react';
import { dbService } from 'fbase';
import Nweet from 'components/Nweet';
import "css/Home.css"
import { Table, Tag, Space } from 'antd';
import 'antd/dist/antd.css';

const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);

    // const getNweets = async () => {
    //     const dbNweets = await dbService.collection("nweets").get();
    //     dbNweets.forEach((document) => {
    //         const nweetObject = { ...document.data(), id: document.id };
    //         setNweets((prev) => [nweetObject, ...prev])
    //     });
    // };

    useEffect(() => {
        // getNweets();
        dbService.collection("nweets").where("createdAt", ">", new Date()).onSnapshot((snapshot) => {
            const newArray = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            }));
            setNweets(newArray);
        });
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("nweets").add({
            text: nweet,
            createdAt: new Date(),
            creatorId: userObj.uid,
        });
        setNweet("");
    };

    const onChange = (event) => {
        event.preventDefault();
        const { target: { value }, } = event;
        setNweet(value);
    }
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
                <Tag color={'red'}>A</Tag>
                <Tag color={'green'}>B</Tag>
                <Tag color={'red'}>C</Tag>
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

    const data = [
        {
            key: '1',
            device: 'devcie#1',
            datetime: '2021-10-22 23:22',
        },
        {
            key: '2',
            device: 'devcie#2',
            datetime: '2021-10-22 23:22',
        },
        {
            key: '3',
            device: 'devcie#3',
            datetime: '2021-10-22 23:22',
        }
    ]
    const dataSelect = [
        {
            key: '1',
            Phase: 'A',
            datetime: '2021-10-22 23:22',
        },
        {
            key: '2',
            Phase: 'B',
            datetime: '2021-10-22 23:22',
        },
        {
            key: '3',
            Phase: 'C',
            datetime: '2021-10-22 23:22',
        }
    ]



    return (
        <>
            <Table columns={columns} dataSource={data} pagination={false} />
            <select name="device">
                <option value="1">Device#1</option>
                <option value="2">Device#2</option>
                <option value="3">Device#3</option>
            </select>
            <Table columns={columnsSelect} dataSource={dataSelect} pagination={false} />
            {/* <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
                <input type="submit" value="Nweet" />
            </form>
            <input type="datetime-local" />
            <div>
                {nweets.map((nweet) => (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
                ))}
            </div> */}
            {/* <table>
                <th>장비명</th>
                <th>업데이트 시간</th>
                <th>알람 상태</th>
                <tr>
                    <td>
                        device#1
                    </td>
                    <td>
                        {new Date().toLocaleString().substring(0, 21)}
                    </td>
                    <td>
                        <span>A</span>
                        <span>B</span>
                        <span>C</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        device#2
                    </td>
                    <td>
                        {new Date().toLocaleString().substring(0, 21)}
                    </td>
                    <td>
                        <span>A</span>
                        <span>B</span>
                        <span>C</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        device#3
                    </td>
                    <td>
                        {new Date().toLocaleString().substring(0, 21)}
                    </td>
                    <td>
                        <span>A</span>
                        <span>B</span>
                        <span>C</span>
                    </td>
                </tr>
            </table> */}
        </>
    )
}

export default Home
