const options = {
    filterType: "multiselect",
    print: false,
    downloadOptions: {
        filename: "raport.csv",
        filterOptions: {
            useDisplayedColumnsOnly: true,
            useDisplayedRowsOnly: true
        }
    },
}

const columns = [
    {
        name: "cycle",
        label: "Stopień",
        options: {
            filter: false,
            sort: false
        }
    },
    {
        name: "year",
        label: "Rok",
        options: {
            filter: false,
            sort: true,
        }
    },
    {
        name: "recruitment_round",
        label: "Cykl",
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: "faculty",
        label: "Wydział",
        options: {
            filter: true,
            sort: false,
        }
    },
    {
        name: "field_of_study",
        label: "Kierunek",
        options: {
            filter: true,
            sort: false,
        }
    },
    {
        name: "status",
        label: "Status",
        options: {
            filter: true,
            sort: false,
        }
    },
    {
        name: "points",
        label: "Punkty",
        options: {
            filter: false,
            sort: true,
        }
    },
    {
        name: "first_name",
        label: "Imię",
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: "last_name",
        label: "Nazwisko",
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: "year_of_exam",
        label: "Rok matury",
        options: {
            filter: false,
            sort: true,
        }
    },
    {
        name: "city",
        label: "Miasto",
        options: {
            filter: true,
            sort: false,
        }
    },
    {
        name: "year_of_birth",
        label: "Rok urodzenia",
        options: {
            filter: false,
            sort: true,
        }
    },

]

const fakeData = [
    { cycle: 1, year: 2020, recruitment_round: 1, faculty: "Wiet", field_of_study: "Informatyka", status: "+", points: 953, first_name: "Jan", last_name: "Kowalski", year_of_exam: 2019, city: "Kraków", year_of_birth: 1999 },
    { cycle: 1, year: 2020, recruitment_round: 1, faculty: "Wiet", field_of_study: "Informatyka", status: "+", points: 953, first_name: "Jan", last_name: "Kowalski", year_of_exam: 2019, city: "Kraków", year_of_birth: 1999 },
    { cycle: 1, year: 2019, recruitment_round: 1, faculty: "Wiet", field_of_study: "Informatyka", status: "+", points: 953, first_name: "Jan", last_name: "Kowalski", year_of_exam: 2019, city: "Kraków", year_of_birth: 1999 },
    { cycle: 1, year: 2020, recruitment_round: 1, faculty: "Wiet", field_of_study: "Informatyka", status: "+", points: 953, first_name: "Jan", last_name: "Kowalski", year_of_exam: 2019, city: "Kraków", year_of_birth: 1999 },
    { cycle: 1, year: 2020, recruitment_round: 1, faculty: "Wiet", field_of_study: "Informatyka", status: "+", points: 953, first_name: "Jan", last_name: "Kowalski", year_of_exam: 2019, city: "Kraków", year_of_birth: 1999 },
    { cycle: 1, year: 2020, recruitment_round: 1, faculty: "Wiet", field_of_study: "Informatyka", status: "+", points: 953, first_name: "Jan", last_name: "Kowalski", year_of_exam: 2019, city: "Kraków", year_of_birth: 1999 },
]
export { options, columns, fakeData }
