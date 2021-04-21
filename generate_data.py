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
        self.city = GraduatedSchool().city

    def __str__(self) -> str:
        return convert_to_str(vars(self))


# class HighSchool:
#     def __init__(self):
#         self.school_city = fake.city()
#         self.school_type = random.choice(['T', 'L'])
#         self.school_name = (
#             random.choice(["STZN", "technikum nr VI", "technikum nr II"])
#             if self.school_type == 'T' else
#             random.choice(["VIII LO", "IX LO", "I LO"]))
#         self.faculty = 'null'
#         self.field_of_study = 'null'
#         self.mode = 'null'


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

    def __init__(self):
        self.faculty_name, self.fof_name = random.choice(FieldOfStudy.fofs)
        self.degree = random.choice(["1"]*4 + ["2"])
        self.mode = random.choice(["stacjonarne"]*4 + ["niestacjonarne"])

class GraduatedSchool:
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

    universities = [("Kraków", "AGH", "B", "") + fof for fof in FieldOfStudy.fofs] + [
        ("Kraków", "UJ", "B", "", "TCS", "TCS"),
        ("Kraków", "UJ", "B", "", "Filozoficzny", "Filozofia"),
        ("Kraków", "PK", "B", "", "Ogólny", "Informatyka"),
        ("Kraków", "PK", "B", "", "Ogólny", "Robotyka"),
        ("Kraków", "PK", "B", "", "Ogólny", "Budownictwo"),
        ("Wrocław", "PW", "B", "", "Ogólny", "Informatyka"),
        ("Warszawa", "UW", "B", "", "Ogólny", "Informatyka"),
        ("Warszawa", "PW", "B", "", "Ogólny", "Informatyka"),
    ]
    def __init__(self):
        self.city, self.name, self.degree, self.date, self.faculty, self.fof = random.choice(GraduatedSchool.hss*4 + GraduatedSchool.universities)

# HIGH_SCHOOL = [
#     {'school_city': 'Katowice', 'school_type': 'T',
#      'school_name': 'STZN', 'faculty': '', 'field_of_study': '',
#      'mode': 'stacjonarne'},
#     {'school_city': 'Katowice', 'school_type': 'L',
#      'school_name': 'VIII LO', 'faculty': '', 'field_of_study': '',
#      'mode': 'stacjonarne'},
#     {'school_city': 'Krakow', 'school_type': 'L',
#      'school_name': 'V LO', 'faculty': '', 'field_of_study': '',
#      'mode': 'stacjonarne'},
# ]

# UNIVERSITY = [
#     {'school_city': 'Krakow', 'school_type': 'S1I',
#      'school_name': 'AGH', 'faculty': 'WIET', 'field_of_study': 'Informatyka',
#      'mode': 'zaoczne'},
#     {'school_city': 'Krakow', 'school_type': 'S1I',
#      'school_name': 'AGH', 'faculty': 'WIET', 'field_of_study': 'Informatyka',
#      'mode': 'stacjonarne'},
#     {'school_city': 'Krakow', 'school_type': 'S2M',
#      'school_name': 'AGH', 'faculty': 'WIET', 'field_of_study': 'Informatyka',
#      'mode': 'zaoczne'},
#     {'school_city': 'Krakow', 'school_type': 'S2M',
#      'school_name': 'AGH', 'faculty': 'WIET', 'field_of_study': 'Informatyka',
#      'mode': 'stacjonarne'},

#     {'school_city': 'Krakow', 'school_type': 'S1I',
#      'school_name': 'PK', 'faculty': 'WSI', 'field_of_study': 'Elektronika',
#      'mode': 'stacjonarne'},
#     {'school_city': 'Krakow', 'school_type': 'S2M',
#      'school_name': 'PK', 'faculty': 'WSI', 'field_of_study': 'Elektronika',
#      'mode': 'stacjonarne'},

#     {'school_city': 'Gdansk', 'school_type': 'S1L',
#      'school_name': 'Uczelnia w Gadansku', 'faculty': 'WCI',
#      'field_of_study': 'Odlewnictwo',
#      'mode': 'zaoczne'},
#     {'school_city': 'Gdansk', 'school_type': 'S1L',
#      'school_name': 'Uczelnia w Gadansku', 'faculty': 'WCI',
#      'field_of_study': 'Odlewnictwo',
#      'mode': 'stacjonarne'},
#     {'school_city': 'Gdansk', 'school_type': 'S2M',
#      'school_name': 'Uczelnia w Gadansku', 'faculty': 'WCI',
#      'field_of_study': 'Odlewnictwo',
#      'mode': 'zaoczne'},
#     {'school_city': 'Gdansk', 'school_type': 'S2M',
#      'school_name': 'Uczelnia w Gadansku', 'faculty': 'WCI',
#      'field_of_study': 'Odlewnictwo',
#      'mode': 'stacjonarne'}
# ]


# class University:
#     def __init__(self):
#         self.school_city = fake.city()
#         self.school_type = random.choice(['S1L', 'S1I', 'S2M'])
#         self.school_name = random.choice(["UJ", "AGH", "PK"])
#         self.faculty = random.choice(["WIET", "WGIG", "WEAIIB"])
#         self.field_of_study = random.choice(
#             ["Informatyka", "Elektornika", "Odlewnictwo"])
#         self.mode = random.choice(["zaoczne", "stacjonarne"])


# class Grade:
#     def __init__(self) -> None:
#         self.IT = random.randint(2, 6)
#         self.math = random.randint(2, 6)
#         self.english = random.randint(2, 6)


# class ExamResult:
#     def __init__(self) -> None:
#         self.IT = random.randint(30, 100)
#         self.math = random.randint(30, 100)
#         self.english = random.randint(30, 100)


class Recruitment:
    def __init__(self) -> None:
        self.year = random.randint(2018, 2020)
        self.round = random.randint(1,3)
        self.field_of_study = FieldOfStudy()
        self.points = random.randint(800, 1000) if self.field_of_study.fof_name=="Informatyka" else random.randint(100,1000)
        self.olympiad = random.choice(["Diament"] *3 + ["OM"] + [""] * 20 )
        self.result = random.choice(
            [
                "nieprzyjęty z powodu niedokonania wpisu",
                "niezakwalifikowany",
                "rekrutacja zakończona",
                "wpisany",
                "rekrutacja zakończona",
                "wpisany",
            ]
        )


# def main(persons: Any, file_name: Any) -> Any:
#     with open(file_name, 'w') as file:
#         record = [vars(Candidate()), random.choice(HIGH_SCHOOL),
#                   vars(Grade()), vars(ExamResult()), vars(Recruitment(1))]
#         dictionary = []
#         for rec in record:
#             for x in rec.keys():
#                 dictionary.append(x)

#         print(','.join(dictionary))
#         for i in range(persons):
#             record = [vars(Candidate()), random.choice(HIGH_SCHOOL),
#                       vars(Grade()), vars(ExamResult())]
#             for nr in range(1, 6):
#                 if random.random() > 0.8:
#                     break
#                 print(
#                     ','.join(convert_to_str(x) for x in record +
#                              [vars(Recruitment(nr))]), file=file)

def main(persons: Any, file_name: Any) -> Any:
    f = open(file_name, "w")
    print(
        "no", "rok", "runda",
        "rodzaj", "stopień", "wydział", "kierunek",
        "status", "punkty", "olimpiada", "data_aplikacji",
        "nazwisko", "imię", "imię2", "imię_ojca", "imię_matki", "pesel", "płeć", 
        "ulica", "nr_domu", "nr_mieszkania", "miasto", "kod_pocztowy", "poczta", "kraj", "email",
        "szkoła_kraj", "szkoła_miasto", "szkoła_nazwa", "szkoła_data", "szkoła_stopień", "szkoła_wydział", "szkoła_kierunek", 
        sep=","
    )
    for i in range(persons):
        c = Candidate()
        r = Recruitment()
        fof = r.field_of_study
        gs = GraduatedSchool()

        print(random.randint(1000,10000), r.year, r.round, # ogólne
              fof.mode, fof.degree, fof.faculty_name, fof.fof_name, # wydział gdzie aplikował
              r.result, r.points, r.olympiad, "", # z jakim wynikiem
              c.last_name, c.first_name, "", "", "", random.randint(10**10, 10**11), c.gender, # kto aplikował
              "","","", c.city, "", "", "PL", "", # skąd jest
              "PL", gs.city, gs.name, gs.date, gs.degree, gs.faculty, gs.fof, # z jakiej poprzedniej szkoły
              sep=",", file=f
        )


if __name__ == '__main__':
    main(persons=100, file_name='new_generated_data.csv')
