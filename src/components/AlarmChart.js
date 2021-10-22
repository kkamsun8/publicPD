import { Bar } from 'react-chartjs-2';

const AlarmChart = ({ alarmData, color, label }) => {

    const now = new Date()
    const labels = [...Array(60)].map((v, i) => new Date(now.setMinutes(now.getMinutes() + 1)).toTimeString().substring(0, 5))
    console.log(labels);

    const data1 = alarmData || [...Array(60)].map(() => Math.floor(Math.random() * 2));


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

    };
    return (
        <>
            <Bar id={"bar"} data={data} options={options} height={100} />

        </>
    )
}

export default AlarmChart
