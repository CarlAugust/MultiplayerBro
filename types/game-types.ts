export enum Color
{
    red = "red",
    blue = "blue",
    purple = "purple",
    yellow = "yellow",
    green = "green"
};

export interface Player {
    id: number,
    x: number,
    y: number,
    color: Color
};