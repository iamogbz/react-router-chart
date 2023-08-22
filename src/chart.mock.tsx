import * as React from "react";
import { redirect, RouteObject } from "react-router-dom";

import { $, $$, Chart } from "./chart";

export const routes: RouteObject[] = [
    {
        element: <div></div>,
        children: [
            {
                index: true,
                element: <div></div>,
            },
            {
                element: <div></div>,
            },
        ],
    },
    {
        path: "/",
        element: <div></div>,
        children: [
            {
                path: "home",
                element: <div></div>,
                index: true,
            },
            {
                path: "register",
                loader: () => redirect("/sign/up"),
            },
            {
                path: "sign",
                index: false,
                children: [
                    {
                        index: true,
                        element: <div></div>,
                    },
                    {
                        path: "in",
                        element: <div></div>,
                    },
                    {
                        path: "up",
                        element: <div></div>,
                    },
                ],
            },
        ],
    },
];

export const namedRoutes = {
    [Chart.ROOT]: {
        [$]: "/",
        [$$]: "/home",
        home: {
            [$]: "/home",
        },
        register: {
            [$]: "/register",
        },
        sign: {
            [$]: "/sign",
            in: {
                [$]: "/sign/in",
            },
            up: {
                [$]: "/sign/up",
            },
        },
    },
};
