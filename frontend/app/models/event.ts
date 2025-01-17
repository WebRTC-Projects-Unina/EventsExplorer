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
    Location: Location | undefined,
    locationId: string
};

type Login = {
    username: string,
    password: string,
    token: string
};

export { Event, ImageFile, Location, Login };