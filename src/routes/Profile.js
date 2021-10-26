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
    const [count, setCount] = useState();
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

    useEffect(() => {
        const unsubscribe = dbService.collection("RealTime").where("device", "==", device).onSnapshot((snapshot) => {
            const realTime = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            }));
            console.log(realTime)
            let newDate = realTime[0].datetime.toDate();
            newDate.setMinutes(newDate.getMinutes() - 59);

            const firetime = firebase.firestore.Timestamp.fromDate(newDate);
            getData(firetime, device);
        });
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
