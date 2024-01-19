import { PropsWithChildren } from "react";

export type FormInstance = {
    submit: () => void;
    reset: () => void;
    getValues: () => any;
};

export type FormProps = {
    form?: FormInstance;
    element?: any;
};

export type FormItemProps = {
    name?: string;
    label?: string;
    rules?: any[];
    children?: React.ReactElement;
    required?: boolean;
    colon?: boolean;
};

export type RcStateFormProps = PropsWithChildren<FormProps & React.FormHTMLAttributes<HTMLFormElement>>;
