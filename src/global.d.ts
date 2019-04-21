import { RouteProps, RouteComponentProps } from "react-router";

export interface AnyObject {
    [key: string]: any;
}

export interface Suffixes {
    [name: string]: string;
}

export type ReactRouteProps = RouteProps & { key?: string };

export interface RouteShape {
    name?: string;
    props?: ReactRouteProps;
    renderProps?: AnyObject;
    suffixes?: Suffixes;
    nest?: {
        props?: ReactRouteProps;
        renderProps?: AnyObject;
        routes?: RouteShape[];
    };
}

export interface RouteRenderProps {
    name: string;
    props: ReactRouteProps;
    renderProps: AnyObject;
}

export type RouteDirection = {
    [$: string]: string;
} & AnyObject;
