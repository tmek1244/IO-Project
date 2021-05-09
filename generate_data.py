import random
import datetime
from typing import Any, Dict, Union

from faker import Faker

fake = Faker()


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
        self.city = GraduadedSchool().city

    def __str__(self) -> str:
        return convert_to_str(vars(self))


class FieldOfStudy:
    fofs = [
        ("WIET", "Informatyka"),
        ("WIET", "Elektronika"),
        ("WIET", "Telekomunikacja"),
        ("WMS", "Matematyka"),
        ("WIMIR", "Automatyka"),
        ("WIMIR", "Robotyka"),
        ("FIS", "Fizyka"),
        ("FIS", "Informatyka"),
        ("Zarządzania", "Zarządzanie"),
        ("Ogólny", "Górnicwo"),
        ("Ogólny", "Hutnictwo"),
    ]

    def __init__(self) -> None:
        self.faculty_name, self.fof_name = random.choice(FieldOfStudy.fofs)
        self.degree = random.choice(["1"]*4 + ["2"])
        self.mode = random.choice(["stacjonarne"]*4 + ["niestacjonarne"])


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

    universities = [
        ("Kraków", "AGH", "1", "") + fof for fof in FieldOfStudy.fofs] + [
        ("Kraków", "UJ", "1", "", "TCS", "TCS"),
        ("Kraków", "UJ", "1", "", "Filozoficzny", "Filozofia"),
        ("Kraków", "PK", "1", "", "Ogólny", "Informatyka"),
        ("Kraków", "PK", "1", "", "Ogólny", "Robotyka"),
        ("Kraków", "PK", "1", "", "Ogólny", "Budownictwo"),
        ("Wrocław", "PW", "1", "", "Ogólny", "Informatyka"),
        ("Warszawa", "UW", "1", "", "Ogólny", "Informatyka"),
        ("Warszawa", "PW", "1", "", "Ogólny", "Informatyka"),
    ]

    def __init__(self) -> None:
        self.city, self.name, self.degree, self.date, self.faculty, self.fof =\
            random.choice(GraduadedSchool.hss*4 + GraduadedSchool.universities)


class Recruitment:
    def __init__(self) -> None:
        self.year = random.randint(2018, 2020)
        self.round = random.randint(1, 3)
        self.field_of_study = FieldOfStudy()
        self.points = (
            random.randint(800, 1000)
            if self.field_of_study.fof_name == "Informatyka"
            else random.randint(100, 1000))
        self.olympiad = random.choice(["Diament"] * 3 + ["OM"] + [""] * 20)
        self.result = random.choice(
            [
                "unregistered",
                "rejected",
                "accepted",
                "signed",
                "accepted",
                "signed",
            ]
        )


def main(persons: Any, file_name: Any) -> Any:
    f = open(file_name, "w")
    print(
        "no", "rok", "runda",
        "rodzaj", "stopień", "wydział", "kierunek",
        "status", "punkty", "olimpiada", "data_aplikacji",
        "nazwisko", "imię", "imię2", "imię_ojca", "imię_matki",
        "pesel", "płeć", "data_urodzenia"
        "ulica", "nr_domu", "nr_mieszkania", "miasto", "kod_pocztowy",
        "poczta", "kraj", "email",
        "szkoła_kraj", "szkoła_miasto", "szkoła_nazwa", "szkoła_data",
        "szkoła_stopień", "szkoła_wydział", "szkoła_kierunek",
        sep=","
    )
    for i in range(persons):
        c = Candidate()
        r = Recruitment()
        fof = r.field_of_study
        gs = GraduadedSchool()

        print(random.randint(1000, 10000), r.year, r.round,  # ogólne
              fof.mode, fof.degree, fof.faculty_name, fof.fof_name,  # wydział
              r.result, r.points, r.olympiad, "",  # z jakim wynikiem
              c.last_name, c.first_name, "", "", "",
              random.randint(10**10, 10**11), c.gender, c.date_of_birth,  # kto
              "", "", "", c.city, "", "", "PL", "",  # skąd jest
              "PL", gs.city, gs.name, gs.date, gs.degree, gs.faculty,
              gs.fof,  # z jakiej poprzedniej szkoły
              sep=",", file=f
              )


if __name__ == '__main__':
    main(persons=100, file_name='new_generated_data.csv')
