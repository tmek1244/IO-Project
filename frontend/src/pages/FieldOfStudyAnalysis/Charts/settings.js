
//TODO dodać sensowne kolory w ilości wystarczjącej na wszystkie cykle
export const colors = [
    'rgb(27,89,196)', 'rgb(108, 182, 115)', 'rgb(183, 78, 80)',
    'rgb(99, 76, 76)', 'rgb(45, 47, 153)', 'rgb(104, 106, 201)',
]

export const commonOptions = {
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                },
            },
        ],
    },
    //TODO: REMOVE?
    animation: {
        duration: 0
    }
};