import { authService } from 'fbase';
import { useHistory } from 'react-router-dom';
import Chart from 'components/Chart';
import { dbService } from 'fbase';
import { useState, useEffect } from 'react';
import "css/Profile.css"
import AlarmChart from 'components/AlarmChart';
import firebase from 'firebase';
const Profile = () => {
    // const [sizeWidth, setSizeWidth] = useState(window.innerWidth);
    // const [sizeHeight, setSizeHeight] = useState(window.innerHeight);

    // const setSize = () => {
    //     setSizeWidth(window.innerWidth);
    //     setSizeHeight(window.innerHeight);
    //     console.log(window.innerWidth)
    // }

    // useEffect(() => {
    //     window.addEventListener('resize', setSize);
    //     return () => {
    //         window.removeEventListener('resize', () => console.log('size'));
    //     };
    // }, []);

    const [device, setdevice] = useState(1);
    const [count, setCount] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getData = async (firetime, device) => {
        // setIsLoading(false);
        const data = await dbService.collection("PD").where("device", "==", device).where("datetime", ">=", firetime).orderBy("datetime", "desc").get();
        console.log(data);
        let newData = [];
        data.forEach((document) => { newData = [...newData, document.data()] })
        console.log(newData);
        setCount(newData);
        if (isLoading) { }
        else {
            setIsLoading(true);
        }
    }

    const getRealTime = (device) => {
        let newData = [];
        dbService.collection("RealTime").where("device", "==", device).get().then((doc) => {
            let realDate;
            doc.forEach((document) => realDate = document.data().datetime)
            console.log(realDate);
            let fromDate = new Date(realDate.toDate());
            fromDate.setMinutes(fromDate.getMinutes() - 59);
            const fireFromDate = firebase.firestore.Timestamp.fromDate(fromDate);
            dbService.collection("PD").where("device", "==", device).where("datetime", ">=", fireFromDate).orderBy("datetime", "desc").get().then((doc) => {
                doc.forEach((document) => { newData = [...newData, document.data()] });
                const firerealDate = firebase.firestore.Timestamp.fromDate(realDate.toDate());
                console.log(newData);
            });
        });
        return newData;
    }


    useEffect(() => {
        setIsLoading(false);
        setCount([]);
        const realDate = firebase.firestore.Timestamp.fromDate(new Date());
        const unsubscribe = dbService.collection("RealTime").where("device", "==", device).onSnapshot((snapshot) => {
            const realTime = snapshot.docs.map((document) => ({
                ...document.data(),
            }));
            setCount((prev) => {
                const data = [realTime[0], ...prev];
                let time = realTime[0].datetime.toDate();
                console.log(time);
                time.setMinutes(time.getMinutes() - 59);
                console.log(time);
                console.log(data);
                const newData = data.filter((v) => v.datetime.toDate() >= time);
                return newData;
            })
            setIsLoading(true);
        })
        return () => {
            unsubscribe();
        }
    }, [device]);

    const deviceChange = (e) => {
        // setIsLoading(false);
        e.preventDefault();
        setdevice(parseInt(e.target.value));
    }

    const history = useHistory();

    const onLogOutClick = () => {
        authService.signOut()
        history.push("/");
    };
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
                        <AlarmChart color='rgb(255, 99, 132)' label='A상' index='alarmA' alarm={count} />
                        <AlarmChart color='rgb(255, 205, 86)' label='B상' index='alarmB' alarm={count} />
                        <AlarmChart color='rgb(54, 162, 235)' label='C상' index='alarmC' alarm={count} />
                    </>
                ) : (<p>Loading....</p>)}
            </div>
        </div>
    )
}

export default Profile
