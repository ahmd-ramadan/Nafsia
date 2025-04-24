import { UserRolesEnum } from "../enums";

export const manageSession: UserRolesEnum[] = [
    UserRolesEnum.DOCTOR
]

export const accessToSession: UserRolesEnum[] = [
    UserRolesEnum.USER
]

export const getSession: UserRolesEnum[] = [
    UserRolesEnum.USER,
    UserRolesEnum.DOCTOR
]