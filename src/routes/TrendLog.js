import React, { useState, useEffect } from 'react'
import "css/TrendLog.css";
import Chart from 'components/Chart';
import AlarmChart from 'components/AlarmChart';
import { dbService } from 'fbase';
import firebase from 'firebase';
import { Doughnut } from 'react-chartjs-2';
import { Table } from 'antd';
import 'antd/dist/antd.css';


const timeString = () => {
    var timezoneOffset = new Date().getTimezoneOffset() * 60000;
    var timezoneDate = new Date(Date.now() - timezoneOffset);
    return timezoneDate.toISOString().substring(0, 16);
}


const TrendLog = () => {
    const [device, setdevice] = useState(1);
    const [log, setLog] = useState('pulseMax');
    const [datetime, setDatetime] = useState(timeString());
    const [isLoading, setIsLoading] = useState(false);
    const [count, setCount] = useState([]);
    const [dougnutDataA, setDougnutDataA] = useState();
    const [dougnutDataB, setDougnutDataB] = useState();
    const [dougnutDataC, setDougnutDataC] = useState();
    const [tableData, setTableData] = useState();
    const [columns, setColumns] = useState();

    const deviceChange = (e) => setdevice(parseInt(e.target.value));
    const logChange = (e) => setLog(e.target.value);

    const datetimeChange = (e) => {
        console.log(typeof (e.target.value))
        setDatetime(e.target.value);
    }

    const getData = async (firetime, firetimeTo, device) => {
        // setIsLoading(false);
        console.log(firetime);
        console.log(firetimeTo);
        console.log(device);
        const data = await dbService.collection("PD").where("device", "==", device).where("datetime", "<=", firetime).where("datetime", ">=", firetimeTo).orderBy("datetime", "desc").limit(60).get();
        let newData = [];
        data.forEach((document) => { newData = [...newData, document.data()] })
        console.log(newData);
        setCount(newData);
        if (isLoading) { }
        else {
            setIsLoading(true);
        }
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
        const newDate = new Date(datetime);
        console.log(newDate);
        let ToDate = new Date(newDate);
        ToDate.setMinutes(ToDate.getMinutes() - 60);
        const firetime = firebase.firestore.Timestamp.fromDate(newDate);
        const firetimeTo = firebase.firestore.Timestamp.fromDate(ToDate);
        getData(firetime, firetimeTo, device);

    }, [device, datetime]);



    const dougnutOption = {
        responsive: false,
        plugins: {
            legend: {
                display: false,
                position: 'right',
            },
        }
    }


    return (
        <>
            <div className="form">
                <select name="device" value={device} onChange={deviceChange}>
                    <option value="1">Device#1</option>
                    <option value="2">Device#2</option>
                    <option value="3">Device#3</option>
                </select>
                <input className="datetime" type="datetime-local" onChange={datetimeChange} value={datetime} />
            </div>
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
        </>
    )
}

export default TrendLog
