import { Bar } from 'react-chartjs-2';

const Chart = ({ a, b, c, count }) => {
    console.log(count);
    let labels;
    console.log(count.length);
    if (count.length !== 0) {
        let now = new Date(count[0].datetime.toDate());
        now = new Date(now.setMinutes(now.getMinutes() + 1));
        labels = [...Array(60)].map((v, i) => new Date(now.setMinutes(now.getMinutes() - 1)).toTimeString().substring(0, 5)).reverse();
    } else {
        labels = [];
    }


    // const data1 = a || [...Array(60)].map(() => Math.floor(Math.random() * 10));
    // const data2 = b || [...Array(60)].map(() => Math.floor(Math.random() * 10));
    // const data3 = c || [...Array(60)].map(() => Math.floor(Math.random() * 10));
    // const data1 = [{ x: '16:53', y: 10 }]

    const data1 = count.map((v) => ({
        x: v.datetime.toDate().toTimeString().substring(0, 5),
        y: v.A
    }))

    const data2 = count.map((v) => ({
        x: v.datetime.toDate().toTimeString().substring(0, 5),
        y: v.B
    }))

    const data3 = count.map((v) => ({
        x: v.datetime.toDate().toTimeString().substring(0, 5),
        y: v.C
    }))

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
