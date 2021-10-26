import React, { useState, useEffect } from 'react'
import "css/TrendLog.css";
import Chart from 'components/Chart';
import AlarmChart from 'components/AlarmChart';
import { dbService } from 'fbase';
import firebase from 'firebase';


const timeString = () => {
    var timezoneOffset = new Date().getTimezoneOffset() * 60000;
    var timezoneDate = new Date(Date.now() - timezoneOffset);
    return timezoneDate.toISOString().substring(0, 16);
}


const TrendLog = () => {
    const [device, setdevice] = useState(1);
    const [datetime, setDatetime] = useState(timeString());
    const [isLoading, setIsLoading] = useState(false);
    const [count, setCount] = useState();
    console.log(datetime);
    const deviceChange = (e) => setdevice(parseInt(e.target.value));
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
    }


    useEffect(() => {
        const newDate = new Date(datetime);
        console.log(newDate);
        let ToDate = new Date(newDate);
        ToDate.setMinutes(ToDate.getMinutes() - 59);
        const firetime = firebase.firestore.Timestamp.fromDate(newDate);
        const firetimeTo = firebase.firestore.Timestamp.fromDate(ToDate);
        getData(firetime, firetimeTo, device);

    }, [device, datetime]);
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
                    <AlarmChart color='rgb(255, 99, 132)' label='A상' index='alarmA' alarm={count} />
                    <AlarmChart color='rgb(255, 205, 86)' label='B상' index='alarmB' alarm={count} />
                    <AlarmChart color='rgb(54, 162, 235)' label='C상' index='alarmC' alarm={count} />
                </>
            ) : (<p>Loading....</p>)}
        </>
    )
}

export default TrendLog
