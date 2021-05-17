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

const basicColumns = [
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
]

const laureateColumn = [
    {
        name: "laureate_no",
        label: "Liczba laureatów",
        options: {
            filter: false,
            sort: true,
        }
    }
]

const statusColumn = [
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

const firstCycleColumns = basicColumns.concat(laureateColumn, statusColumn)

const secondCycleColumns = basicColumns.concat(statusColumn)

export { options, firstCycleColumns, secondCycleColumns }
