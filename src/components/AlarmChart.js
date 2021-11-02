import { Bar } from 'react-chartjs-2';

const AlarmChart = ({ alarmData, color, label, alarm, index }) => {
    let labels;
    if (alarm.length !== 0) {
        let now = new Date(alarm[0].datetime.toDate());
        now = new Date(now.setMinutes(now.getMinutes() + 1));
        labels = [...Array(60)].map((v, i) => new Date(now.setMinutes(now.getMinutes() - 1)).toTimeString().substring(0, 5)).reverse();
    } else {
        labels = [];
    }
    // const data1 = alarmData || [...Array(60)].map(() => Math.floor(Math.random() * 2));

    const data1 = alarm.map((v) => ({
        x: v.datetime.toDate().toTimeString().substring(0, 5),
        y: v.[index],
    }))

    let data = {
        labels: labels,
        datasets: [
            {
                label: label,
                data: data1,
                backgroundColor: [
                    color,
                ],
            },
        ],
    };



    const options = {
        responsive: true,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                min: 0,
                max: 1,
                stacked: true,
            },
        },
        fill: true,
        stepped: true,
    };
    return (
        <>
            <Bar id={"bar"} data={data} options={options} height={100} />

        </>
    )
}

export default AlarmChart
