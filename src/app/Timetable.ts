export interface Timetable{
    class_name: string,
    subjects: {name: string, teacher: string, room: string, batchwise: boolean, batches: string[], num_lectures: number, slots: {day: string, time_slot: string}[] }[],
}