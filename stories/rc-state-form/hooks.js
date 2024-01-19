import { useCallback } from "react";
import { store } from "./@store";
import { get } from "./utils";

export function useFormItemProps(name) {
    const value = store.useSelector((state) => get(state, name)?.value);
    const actions = store.useActions();
    console.log(name, value);

    const onChange = useCallback(
        (value) => {
            if (!name) {
                return;
            }
            if ("target" in value) {
                value = value.target.value;
            }
            actions.setValue(name, value);
        },
        [actions, name]
    );

    return { name, ...(name ? { value, onChange } : {}) };
}
