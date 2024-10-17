export interface Slot {
    name: string, 
    teacher: string, 
    room: string, 
    batchwise: boolean,
    slot_id: number;
    num_batches: number, 
    batches: string[],
    num_lectures: number
}