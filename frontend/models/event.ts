type Location = {
    id: number,
    name: string,
    website: string,
    longitude: number,
    latitude: number
}
type ImageFile = {
    filename: string,
}
type Event = {
    id: number,
    name: string,
    description: string,
    date: string,
    Image: ImageFile | undefined,
    Location: Location | undefined,
    locationId: number,
    Tags: Tag[]
};
type Tag = {
    id?: number,
    name: string
}

type Login = {
    username: string,
    password: string,
    token: string
};

export { Event, ImageFile, Location, Login, Tag };