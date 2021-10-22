import { Bar } from 'react-chartjs-2';

const Chart = ({ a, b, c }) => {
    const now = new Date()
    const labels = [...Array(60)].map((v, i) => new Date(now.setMinutes(now.getMinutes() + 1)).toTimeString().substring(0, 5))
    console.log(labels);

    const data1 = a || [...Array(60)].map(() => Math.floor(Math.random() * 10));
    const data2 = b || [...Array(60)].map(() => Math.floor(Math.random() * 10));
    const data3 = c || [...Array(60)].map(() => Math.floor(Math.random() * 10));


    let data = {
        labels: labels,
        datasets: [
            {
                label: 'A상',
                data: data1,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                ],
            },
            {
                label: 'B상',
                data: data2,
                backgroundColor: [
                    'rgb(255, 205, 86)',
                ],
            },
            {
                label: 'C상',
                data: data3,
                backgroundColor: [
                    'rgb(54, 162, 235)',
                ],
            },
        ],
    };



    const options = {
        responsive: true,
        scales: {
            x: {
                stacked: true,
                title: {
                }
            },
            y: {
                stacked: true
            },
        },

    };
    return (
        <>
            <Bar id={"bar"} data={data} options={options} />

        </>
    )
}

export default Chart
