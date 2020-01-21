export function is_object(obj) {
    return (
        obj !== null && typeof obj !== "undefined" && obj.constructor.name === "Object"
    )
}

export let print = console.log.bind(console)
