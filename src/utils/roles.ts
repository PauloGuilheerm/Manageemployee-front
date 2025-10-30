import { ROLES } from "./enums";

export const can = {
    create: (role: number) => role === ROLES.DIRECTOR || role === ROLES.LEADER,
    edit: (role: number) => role === ROLES.DIRECTOR || role === ROLES.LEADER,
    remove: (role: number) => role === ROLES.DIRECTOR,
    read: () => true,
}


