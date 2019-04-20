interface AnyObject {
    [key: string]: any;
}

interface Suffixes {
    [name: string]: string;
}

interface RouteShape {
    name?: string;
    props?: AnyObject;
    renderProps?: AnyObject;
    suffixes?: Suffixes;
    nest?: {
        props?: AnyObject;
        renderProps?: AnyObject;
        routes?: RouteShape[];
    };
}
