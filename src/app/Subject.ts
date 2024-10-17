import { Teacher } from "./Teacher";

export interface Subject {
    name: string,
    teachers: string[] | undefined,
    isUsed: false,
}