/* eslint-disable @typescript-eslint/no-explicit-any */
import * as ReactRouter from "react-router";

export interface AnyObject {
    [key: string]: any;
}

export interface Suffixes {
    [name: string]: string;
}

export type ReactRouterRouteProps = ReactRouter.RouteProps & { key?: string };

export type ReactRouterRoutePropComponent =
    | React.ComponentType<ReactRouter.RouteComponentProps<any>>
    | React.ComponentType<any>;

export type ReactRouterRoutePropRender = (
    props: ReactRouter.RouteComponentProps<any>,
) => React.ReactNode;

export type ReactRouterRoutePropChildren =
    | ReactRouterRoutePropRender
    | React.ReactNode;

export interface RouteShape {
    name?: string;
    props?: ReactRouterRouteProps;
    renderProps?: AnyObject;
    suffixes?: Suffixes;
    nest?: {
        props?: ReactRouterRouteProps;
        renderProps?: AnyObject;
        routes?: RouteShape[];
    };
}

export interface RouteRenderProps {
    name: string;
    props: ReactRouterRouteProps;
    renderProps: AnyObject;
}

export type RouteDirection = {
    [$: string]: string;
} & AnyObject;
