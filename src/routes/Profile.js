import { authService } from 'fbase';
import { useHistory } from 'react-router-dom';
import Chart from 'components/Chart';
import { dbService } from 'fbase';
import { useState, useEffect } from 'react';
import "css/Profile.css"
import AlarmChart from 'components/AlarmChart';
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

    useEffect(() => {
        // getNweets();
        console.log(device);
        dbService.collection("PD").where("device", "==", device).orderBy("datetime", "desc").limit(3).onSnapshot((snapshot) => {
            const realTime = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            }));
            console.log(realTime)
        });
    }, [device]);

    const deviceChange = (e) => {
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
                <Chart />
                <AlarmChart color='rgb(255, 99, 132)' label='A상' />
                <AlarmChart color='rgb(255, 205, 86)' label='B상' />
                <AlarmChart color='rgb(54, 162, 235)' label='C상' />
            </div>
        </div>
    )
}

export default Profile
