type Location = {
    id: string,
    name: string
}
type ImageFile = {
    filename: string,
}
type Event = {
    id: string,
    name: string,
    description: string,
    date: string,
    Image: ImageFile | undefined,
    Location: Location | undefined
};

export { Event, ImageFile, Location };