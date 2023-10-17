
export function groupBy<T, K extends keyof T>(arr: T[], key: K): Record<string, T[]> {
    return arr.reduce((acc, obj) => {
        const keyValue = obj[key] as string;

        if (!acc[keyValue]) {
            acc[keyValue] = [];
        }

        acc[keyValue].push(obj);

        return acc;
    }, {} as Record<string, T[]>);
}