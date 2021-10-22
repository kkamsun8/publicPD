import React, { useState } from 'react'
import "css/TrendLog.css";
import Chart from 'components/Chart';
import AlarmChart from 'components/AlarmChart';

const TrendLog = () => {
    const [device, setdevice] = useState("1");
    const [datetime, setDatetime] = useState((new Date().toISOString().substring(0, 16)));
    console.log(datetime);
    const deviceChange = (e) => setdevice(e.target.value);
    const datetimeChange = (e) => console.log(e.target.value);
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
            <Chart />
            <AlarmChart color='rgb(255, 99, 132)' label='A상' />
            <AlarmChart color='rgb(255, 205, 86)' label='B상' />
            <AlarmChart color='rgb(54, 162, 235)' label='C상' />
        </>
    )
}

export default TrendLog
