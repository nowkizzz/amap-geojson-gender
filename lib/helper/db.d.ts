export declare function insertFail(value: any): Promise<void>;
export declare function findOneFail(value: any): Promise<{
    _id: string;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
} | null>;
export declare function updateFail(dbData: any, value: any): Promise<void>;
export declare function handleDbError(value: any): Promise<void>;
