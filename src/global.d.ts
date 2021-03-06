import * as ReactRouter from "react-router";

export interface AnyObject {
    [key: string]: unknown;
}

export interface Suffixes {
    [name: string]: string;
}

export type ReactRouterRouteProps = ReactRouter.RouteProps & AnyObject;

export type ReactRouterRoutePropComponent =
    | React.ComponentType<ReactRouter.RouteComponentProps<unknown>>
    | React.ComponentType<unknown>;

export type ReactRouterRoutePropRender = (
    props: ReactRouter.RouteComponentProps<unknown>,
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
