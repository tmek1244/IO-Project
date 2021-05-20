import sys
import random
import datetime
from typing import Any, Dict, List, Union

import pandas as pd
from faker import Faker

fake = Faker()

first_cycle_studies: List[Any] = []
second_cycle_studies: List[Any] = []


def convert_to_str(dictionary: Dict[str, Union[str, datetime.date]]) -> str:
    result = []
    for value in dictionary.values():
        if isinstance(value, datetime.date):
            result.append(value.strftime("%Y-%m-%d"))
        else:
            result.append(str(value))
    return ','.join(result)


class Candidate:
    def __init__(self) -> None:
        self.first_name = fake.first_name()
        self.last_name = fake.last_name()
        self.date_of_birth = fake.date_between(
            start_date='-30y', end_date='-19y')
        self.gender = random.choice(['K', 'M', 'M', ""])
        sth = datetime.datetime.now().year - self.date_of_birth.year - 18
        self.year_of_exam = fake.date_between(
            start_date=f'-{sth}y '
        ).year
        self.city = GraduadedSchool(1).city
        # zahardcodowa miasto ze szkoły średniej

    def __str__(self) -> str:
        return convert_to_str(vars(self))


class FieldOfStudy:

    def __init__(self) -> None:
        self.degree = random.choice(["1"] * 4 + ["2"])
        [self.faculty_name, self.fof_name] = random.choice(
            first_cycle_studies
            if self.degree == 1
            else random.choice(second_cycle_studies)
        )
        self.mode = "stacjonarne"  # na razie skupny się na
        # stacjonarnych, bo nie rozróżniamy tego nawet potem


class GraduadedSchool:
    # [city, name, type, date, faculty, fof]
    hss = [
        ("Kraków", "V", "L", "", "", ""),
        ("Kraków", "III", "L", "", "", ""),
        ("Kraków", "X", "L", "", "", ""),
        ("Warszawa", "III", "L", "", "", ""),
        ("Warszawa", "I", "L", "", "", ""),
        ("Warszawa", "V", "L", "", "", ""),
        ("Katowice", "VIII", "L", "", "", ""),
        ("Katowice", "III", "L", "", "", ""),
        ("Gdańsk", "I", "L", "", "", ""),
        ("Wrocław", "VI", "L", "", "", ""),
        ("Kraków", "I", "T", "", "", ""),
    ]

    def __init__(self, lvl: int) -> None:
        universities = [
            ("Kraków", "AGH", "1", "") + tuple(fof)
            for fof in first_cycle_studies
        ]

        (self.city, self.name,
         self.degree, self.date,
         self.faculty, self.fof) = \
            random.choice(GraduadedSchool.hss) if lvl == 1 else \
            random.choice(universities)


class Recruitment:
    def __init__(self, year: int) -> None:
        self.year = year
        self.round = random.randint(1, 3)
        self.field_of_study = FieldOfStudy()
        self.points = (
            random.randint(800, 1000)
            if self.field_of_study.fof_name == "Informatyka"
            else random.randint(100, 1000))
        self.olympiad = random.choice(["Diament"] * 3 + ["OM"] + [""] * 20)
        self.result = random.choice(
            # TODO poprawić to, bo jest trochę bez sensu,
            #  że ktoś kto ma 1000 punktów nagle może byc nieprzyjęty
            [
                "unregistered",
                "rejected",
                "accepted",
                "signed",
                "accepted",
                "signed",
            ]
        ) if self.olympiad == "" else random.choice(
            [
                "accepted",
                "signed",
            ]
        )


def process_parameters(parameters_file: str) -> Any:
    df = pd.read_csv(parameters_file)
    global first_cycle_studies
    global second_cycle_studies

    first_cycle_studies = \
        df[df['stopien'] == 1][['wydzial', 'kierunek']].values.tolist()
    second_cycle_studies = \
        df[df['stopien'] == 2][['wydzial', 'kierunek']].values.tolist()


def main(persons: Any, file_name: Any, year: int) -> Any:
    f = open(file_name, "w")
    print(
        "no", "rok", "runda",
        "rodzaj", "stopień", "wydział", "kierunek",
        "status", "punkty", "olimpiada", "data_aplikacji",
        "nazwisko", "imię", "imię2", "imię_ojca", "imię_matki",
        "pesel", "płeć", "data_urodzenia",
        "ulica", "nr_domu", "nr_mieszkania", "miasto", "kod_pocztowy",
        "poczta", "kraj", "email",
        "szkoła_kraj", "szkoła_miasto", "szkoła_nazwa", "szkoła_data",
        "szkoła_stopień", "szkoła_wydział", "szkoła_kierunek",
        sep=","
    )
    for i in range(persons):
        c = Candidate()
        r = Recruitment(year=year)
        fof = r.field_of_study
        lvl = 1 if r.field_of_study.degree == 1 else 2
        gs = GraduadedSchool(lvl)

        print(random.randint(1000, 10000), r.year, r.round,  # ogólne
              fof.mode, fof.degree, fof.faculty_name, fof.fof_name,  # wydział
              r.result, r.points, r.olympiad, "",  # z jakim wynikiem
              c.last_name, c.first_name, "", "", "",
              random.randint(10 ** 10, 10 ** 11), c.gender, c.date_of_birth,
              "", "", "", c.city, "", "", "PL", "",  # skąd jest
              "PL", gs.city, gs.name, gs.date, gs.degree, gs.faculty,
              gs.fof,  # z jakiej poprzedniej szkoły
              sep=",", file=f
              )


if __name__ == '__main__':
    '''
        Użycie generatora:
        python generate_data.py [records] [parameters_file] [year]
        gdzie records to licza wpisów, które chcemy wygenerować
        parameters_file to ścieżka do pliku, który zawiera opis rekruatcji,
        czyli wydziały oraz kierunki
        year to rok dla którego dane chcemy generować

        przykładowo:
        python generate_data.py 1000 demo/parameters.csv 2020
        wygeneruje 1000 rekordów dla kierunków i
        wydziałów z pliku parameters.csv dla rekrutacji w 2020
    '''
    records = int(sys.argv[1])
    parameters_file = sys.argv[2]
    year = int(sys.argv[3])

    process_parameters(parameters_file)

    main(persons=records, file_name='new_generated_data.csv', year=year)
