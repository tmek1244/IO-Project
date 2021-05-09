const options = {
    filter: false,
    print: false,
    search: false,
    pagination: false,
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
        name: "year",
        label: "Rok",
        options: {
            filter: false,
            sort: false
        }
    },
    {
        name: "field_of_study",
        label: "Kierunek",
        options: {
            filter: false,
            sort: true,
        }
    },
    {
        name: "recruitment_round",
        label: "Cykl",
        options: {
            filter: false,
            sort: true,
        }
    },
    {
        name: "treshold",
        label: "Próg",
        options: {
            filter: false,
            sort: true,
        }
    },
    {
        name: "mean",
        label: "Średnia",
        options: {
            filter: false,
            sort: true,
        }
    },
    {
        name: "median",
        label: "Mediana",
        options: {
            filter: false,
            sort: true,
        }
    },
    {
        name: "candidates_no",
        label: "Liczba kandydatów na miejsce",
        options: {
            filter: false,
            sort: true,
        }
    },
    {
        name: "laureate_no",
        label: "Liczba laureatów",
        options: {
            filter: false,
            sort: true,
        }
    },
    {
        name: "signed_in",
        label: "Zapisani",
        options: {
            filter: false,
            sort: true,
        }
    },
    {
        name: "not_signed_in",
        label: "Niepotwierdzeni",
        options: {
            filter: false,
            sort: true,
        }
    },
    {
        name: "resigned",
        label: "Zrezygnowali",
        options: {
            filter: false,
            sort: true,
        }
    },
    {
        name: "under_treshold",
        label: "Ponieżej progu",
        options: {
            filter: false,
            sort: true,
        }
    },
]

export { options, columns }
