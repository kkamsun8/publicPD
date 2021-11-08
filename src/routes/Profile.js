
import Chart from 'components/Chart';
import { dbService } from 'fbase';
import { useState, useEffect, useRef } from 'react';
import "css/Profile.css"
import { Doughnut } from 'react-chartjs-2';
import firebase from 'firebase';
import { Table } from 'antd';

const dougnutOption = {
    responsive: false,
    plugins: {
        legend: {
            display: false,
            position: 'right',
        },
    }
}

const Profile = () => {

    let unsubscribe = useRef(null);

    const [device, setdevice] = useState(1);
    const [log, setLog] = useState('pulseMax');
    const [count, setCount] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [dougnutDataA, setDougnutDataA] = useState();
    const [dougnutDataB, setDougnutDataB] = useState();
    const [dougnutDataC, setDougnutDataC] = useState();
    const [tableData, setTableData] = useState();
    const [columns, setColumns] = useState();

    const logChange = (e) => setLog(e.target.value);

    const getRealTime = async (device) => {
        let data = await dbService.collection("PD").where("device", "==", device).orderBy("datetime", "desc").limit(1).get();
        let realDate;
        data.forEach((document) => realDate = document.data().datetime)
        console.log(realDate);
        let fromDate = new Date(realDate.toDate());
        fromDate.setMinutes(fromDate.getMinutes() - 59);
        console.log(fromDate);
        const fireFromDate = firebase.firestore.Timestamp.fromDate(fromDate);
        console.log(fireFromDate);
        data = await dbService.collection("PD").where("device", "==", device).where("datetime", ">=", fireFromDate).orderBy("datetime", "desc").limit(60).get();
        console.log(data);
        let newData = [];
        data.forEach((document) => { newData = [...newData, document.data()] });
        setCount(newData);
        makeAlarmData(newData, setDougnutDataA, 'alarmA');
        makeAlarmData(newData, setDougnutDataB, 'alarmB');
        makeAlarmData(newData, setDougnutDataC, 'alarmC');
        switch (log) {
            case 'pulseMax':
                makeTableDataPulse(newData, setTableData, setColumns);
                break;
            case 'alarm':
                makeTablealarm(newData, setTableData, setColumns);
                break;
            case 'firstAlarm':
                makeTableDataFirstAlarm(newData, setTableData, setColumns);
                break;
            default:
        }
        if (isLoading) { }
        else {
            setIsLoading(true);
        }
        realDate = new Date(newData[0].datetime.toDate());
        const fireRealDate = firebase.firestore.Timestamp.fromDate(realDate);

        unsubscribe.current = dbService.collection("RealTime").where("device", "==", device).where("datetime", ">", fireRealDate).onSnapshot((snapshot) => {
            const realTime = snapshot.docs.map((document) => ({
                ...document.data(),
            }));
            if (realTime.length !== 0) {
                setCount((prev) => {
                    const data = [realTime[0], ...prev];
                    let time = realTime[0].datetime.toDate();
                    time.setMinutes(time.getMinutes() - 59);
                    const newData = data.filter((v) => v.datetime.toDate() >= time);
                    makeAlarmData(newData, setDougnutDataA, 'alarmA');
                    makeAlarmData(newData, setDougnutDataB, 'alarmB');
                    makeAlarmData(newData, setDougnutDataC, 'alarmC');
                    switch (log) {
                        case 'pulseMax':
                            makeTableDataPulse(newData, setTableData, setColumns);
                            break;
                        case 'alarm':
                            makeTablealarm(newData, setTableData, setColumns);
                            break;
                        case 'firstAlarm':
                            makeTableDataFirstAlarm(newData, setTableData, setColumns);
                            break;
                        default:
                    }
                    return newData;
                })
            }
        })

    }

    const makeAlarmData = (newData, setDougnutDataA, alarmA) => {
        let alarm = 0;
        let normal = 0;
        let empty = 0;
        newData.forEach(data => {
            if (data.[alarmA] === 1) { alarm++; }
            else {
                normal++
            }
        })
        empty = 60 - alarm - normal;
        setDougnutDataA(
            {
                labels: ['Alarm', 'Normal', 'Empty'],
                datasets: [
                    {
                        label: 'A상',
                        data: [alarm, normal, empty],
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(75, 192, 192)',
                            'rgb(201, 203, 207)'
                        ],
                    },
                ],
            }
        )
    }
    const makeTableDataPulse = (newData, setTableData, setColumns) => {
        let countA = 0;
        let countB = 0;
        let countC = 0;
        let countAtime = '';
        let countBtime = '';
        let countCtime = '';

        newData.forEach(data => {
            if (countA < data.A) {
                countA = data.A;
                countAtime = new Date(data.datetime.toDate()).toLocaleString('ko-KR',);
            }
            if (countB < data.B) {
                countB = data.B;
                countBtime = new Date(data.datetime.toDate()).toLocaleString('ko-KR',);
            }
            if (countC < data.C) {
                countC = data.C;
                countCtime = new Date(data.datetime.toDate()).toLocaleString('ko-KR',);
            }
        })

        setTableData([
            {
                phase: 'A',
                datetime: countAtime,
                max: countA
            },
            {
                phase: 'B',
                datetime: countBtime,
                max: countB
            },
            {
                phase: 'C',
                datetime: countCtime,
                max: countC
            },
        ])

        setColumns([{
            title: 'Phase',
            dataIndex: 'phase',
            key: 'phase',
        },
        {
            title: '시간',
            dataIndex: 'datetime',
            key: 'datetime',
        },
        {
            title: 'MaxPulse[N]',
            dataIndex: 'max',
            key: 'max',
        },
        ])
    };

    const makeTablealarm = (newData, setTableData, setColumns) => {
        let alarmA = 0;
        let normalA = 0;
        let alarmB = 0;
        let normalB = 0;
        let alarmC = 0;
        let normalC = 0;

        newData.forEach(data => {
            if (data.alarmA === 1) { alarmA++; }
            else {
                normalA++
            }
            if (data.alarmB === 1) { alarmB++; }
            else {
                normalB++
            }
            if (data.alarmC === 1) { alarmC++; }
            else {
                normalC++
            }
        })
        alarmA = Math.round(alarmA / 60 * 100);
        alarmB = Math.round(alarmB / 60 * 100);
        alarmC = Math.round(alarmC / 60 * 100);
        normalA = Math.round(normalA / 60 * 100);
        normalB = Math.round(normalB / 60 * 100);
        normalC = Math.round(normalC / 60 * 100);


        setTableData([
            {
                phase: 'A',
                alarm: alarmA,
                normal: normalA
            },
            {
                phase: 'B',
                alarm: alarmB,
                normal: normalB
            },
            {
                phase: 'C',
                alarm: alarmC,
                normal: normalC
            },
        ])

        setColumns([{
            title: 'Phase',
            dataIndex: 'phase',
            key: 'phase',
        },
        {
            title: 'Alarm[%]',
            dataIndex: 'alarm',
            key: 'alarm',
        },
        {
            title: 'Normal[%]',
            dataIndex: 'normal',
            key: 'normal',
        },
        ])
    };

    const makeTableDataFirstAlarm = (newData, setTableData, setColumns) => {
        let countA = 0;
        let countB = 0;
        let countC = 0;
        let countAtime = '';
        let countBtime = '';
        let countCtime = '';

        newData.forEach(data => {
            if (data.alarmA === 1) {
                countA = data.A;
                countAtime = new Date(data.datetime.toDate()).toLocaleString('ko-KR',);
            }
            if (data.alarmB === 1) {
                countB = data.B;
                countBtime = new Date(data.datetime.toDate()).toLocaleString('ko-KR',);
            }
            if (data.alarmC === 1) {
                countC = data.C;
                countCtime = new Date(data.datetime.toDate()).toLocaleString('ko-KR',);
            }
        })

        setTableData([
            {
                phase: 'A',
                datetime: countAtime,
                max: countA
            },
            {
                phase: 'B',
                datetime: countBtime,
                max: countB
            },
            {
                phase: 'C',
                datetime: countCtime,
                max: countC
            },
        ])

        setColumns([{
            title: 'Phase',
            dataIndex: 'phase',
            key: 'phase',
        },
        {
            title: '시간',
            dataIndex: 'datetime',
            key: 'datetime',
        },
        {
            title: 'MaxPulse[N]',
            dataIndex: 'max',
            key: 'max',
        },
        ])
    };
    useEffect(() => {
        if (count.length !== 0) {
            makeAlarmData(count, setDougnutDataC, 'alarmC');
            switch (log) {
                case 'pulseMax':
                    makeTableDataPulse(count, setTableData, setColumns);
                    break;
                case 'alarm':
                    makeTablealarm(count, setTableData, setColumns);
                    break;
                case 'firstAlarm':
                    makeTableDataFirstAlarm(count, setTableData, setColumns);
                    break;
                default:
            }
        }
    }, [log]);
    useEffect(() => {

        setCount([]);
        getRealTime(device);
        return () => {
            unsubscribe.current();
        }
    }, [device]);

    const deviceChange = (e) => {
        // setIsLoading(false);
        e.preventDefault();
        setdevice(parseInt(e.target.value));
    }

    return (
        <div>
            {/* <button onClick={onLogOutClick}>Log Out</button> */}
            <select name="device" value={device} onChange={deviceChange}>
                <option value="1">Device#1</option>
                <option value="2">Device#2</option>
                <option value="3">Device#3</option>
            </select>
            <div className="chart">
                {isLoading ? (
                    <>
                        <Chart count={count} />
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ backgroundColor: 'rgb(255, 99, 132)', width: '40px', height: '12px', border: 'none' }}>
                                </div>
                                <span style={{ margin: '5px' }}>Alarm</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ backgroundColor: 'rgb(75, 192, 192)', width: '40px', height: '12px', border: 'none' }}>
                                </div>
                                <span style={{ margin: '5px' }}>Normal</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ backgroundColor: 'rgb(201, 203, 207)', width: '40px', height: '12px', border: 'none' }}>
                                </div>
                                <span style={{ margin: '5px' }}>Empty</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <div style={{ width: '100px', height: '100px', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '41%', left: '36%', color: 'rgb(255, 99, 132)' }}>A상</div>
                                <Doughnut data={dougnutDataA} options={dougnutOption} width='100' height='100' />
                            </div>
                            <div style={{ width: '100px', height: '100px', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '41%', left: '36%', color: 'rgb(255, 205, 86)' }}>B상</div>
                                <Doughnut data={dougnutDataB} options={dougnutOption} width='100' height='100' />
                            </div>
                            <div style={{ width: '100px', height: '100px', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '41%', left: '36%', color: 'rgb(54, 162, 235)' }}>C상</div>
                                <Doughnut data={dougnutDataC} options={dougnutOption} width='100' height='100' />
                            </div>
                        </div>
                        <select name="log" value={log} onChange={logChange}>
                            <option value="pulseMax">최대 펄스 갯수</option>
                            <option value="alarm">Alarm</option>
                            <option value="firstAlarm">최초 Alarm 발생시간</option>
                        </select>
                        <Table columns={columns} dataSource={tableData} pagination={false} />
                    </>
                ) : (<p>Loading....</p>)}
            </div>
        </div>
    )
}

export default Profile
