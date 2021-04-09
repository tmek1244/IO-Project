import random
import datetime

from faker import Faker
from typing import Dict, Union


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
    def __init__(self):
        self.first_name = fake.first_name()
        self.last_name = fake.last_name()
        self.data_of_birth = fake.date_between(
            start_date='-30y', end_date='-19y')
        self.gender = random.choice(['kobieta', 'mezczyzna'])
        self.year_of_exam = fake.date_between(
            start_date=f'-{datetime.datetime.now().year - self.data_of_birth.year - 18}y '
        ).year
        self.city = fake.city()

    def __str__(self):
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


HIGH_SCHOOL = [
    {'school_city': 'Katowice', 'school_type': 'T',
     'school_name': 'STZN', 'faculty': '', 'field_of_study': '',
     'mode': 'stacjonarne'},
    {'school_city': 'Katowice', 'school_type': 'L',
     'school_name': 'VIII LO', 'faculty': '', 'field_of_study': '',
     'mode': 'stacjonarne'},
    {'school_city': 'Krakow', 'school_type': 'L',
     'school_name': 'V LO', 'faculty': '', 'field_of_study': '',
     'mode': 'stacjonarne'},
]

UNIVERSITY = [
    {'school_city': 'Krakow', 'school_type': 'S1I',
     'school_name': 'AGH', 'faculty': 'WIET', 'field_of_study': 'Informatyka',
     'mode': 'zaoczne'},
    {'school_city': 'Krakow', 'school_type': 'S1I',
     'school_name': 'AGH', 'faculty': 'WIET', 'field_of_study': 'Informatyka',
     'mode': 'stacjonarne'},
    {'school_city': 'Krakow', 'school_type': 'S2M',
     'school_name': 'AGH', 'faculty': 'WIET', 'field_of_study': 'Informatyka',
     'mode': 'zaoczne'},
    {'school_city': 'Krakow', 'school_type': 'S2M',
     'school_name': 'AGH', 'faculty': 'WIET', 'field_of_study': 'Informatyka',
     'mode': 'stacjonarne'},

    {'school_city': 'Krakow', 'school_type': 'S1I',
     'school_name': 'PK', 'faculty': 'WSI', 'field_of_study': 'Elektronika',
     'mode': 'stacjonarne'},
    {'school_city': 'Krakow', 'school_type': 'S2M',
     'school_name': 'PK', 'faculty': 'WSI', 'field_of_study': 'Elektronika',
     'mode': 'stacjonarne'},

    {'school_city': 'Gdansk', 'school_type': 'S1L',
     'school_name': 'Uczelnia w Gadansku', 'faculty': 'WCI',
     'field_of_study': 'Odlewnictwo',
     'mode': 'zaoczne'},
    {'school_city': 'Gdansk', 'school_type': 'S1L',
     'school_name': 'Uczelnia w Gadansku', 'faculty': 'WCI',
     'field_of_study': 'Odlewnictwo',
     'mode': 'stacjonarne'},
    {'school_city': 'Gdansk', 'school_type': 'S2M',
     'school_name': 'Uczelnia w Gadansku', 'faculty': 'WCI',
     'field_of_study': 'Odlewnictwo',
     'mode': 'zaoczne'},
    {'school_city': 'Gdansk', 'school_type': 'S2M',
     'school_name': 'Uczelnia w Gadansku', 'faculty': 'WCI',
     'field_of_study': 'Odlewnictwo',
     'mode': 'stacjonarne'}
]


# class University:
#     def __init__(self):
#         self.school_city = fake.city()
#         self.school_type = random.choice(['S1L', 'S1I', 'S2M'])
#         self.school_name = random.choice(["UJ", "AGH", "PK"])
#         self.faculty = random.choice(["WIET", "WGIG", "WEAIIB"])
#         self.field_of_study = random.choice(
#             ["Informatyka", "Elektornika", "Odlewnictwo"])
#         self.mode = random.choice(["zaoczne", "stacjonarne"])


class Grade:
    def __init__(self):
        self.IT = random.randint(2, 6)
        self.math = random.randint(2, 6)
        self.english = random.randint(2, 6)


class ExamResult:
    def __init__(self):
        self.IT = random.randint(30, 100)
        self.math = random.randint(30, 100)
        self.english = random.randint(30, 100)


class Recruitment:
    def __init__(self, round_nr):
        self.year = random.randint(2016, 2021)
        self.round = round_nr
        self.field_of_study = random.choice(
            ["Informatyka", "Elektornika", "Odlewnictwo"])
        self.points = random.randint(100, 1000)
        self.result = random.choice(
            ["Accepted", "Rejected", "Signed"])


def main(persons, file_name):
    with open(file_name, 'w') as file:
        record = [vars(Candidate()), random.choice(HIGH_SCHOOL),
                  vars(Grade()), vars(ExamResult()), vars(Recruitment(1))]
        dictionary = []
        for rec in record:
            for x in rec.keys():
                dictionary.append(x)

        print(','.join(dictionary))
        for i in range(persons):
            record = [vars(Candidate()), random.choice(HIGH_SCHOOL),
                      vars(Grade()), vars(ExamResult())]
            for nr in range(1, 6):
                if random.random() > 0.8:
                    break
                print(
                    ','.join(convert_to_str(x) for x in record +
                             [vars(Recruitment(nr))]), file=file)


if __name__ == '__main__':
    main(persons=10, file_name='generated_data.csv')
