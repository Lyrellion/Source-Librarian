export interface Timestamp {
    _seconds: number;
    _nanoseconds: number;
}

export type BlockCount = {
    [blockId: string]: number;
}

export interface Schematic {
    previewImages: string[];
    name: string;
    description: string;
    playerName: string;
    createdAt: Timestamp
    schematic: string;
    public: boolean;
    blockCount: BlockCount;
    mods: string[];
    size: [number, number, number];
}

export interface Error {
    error: string;
}
