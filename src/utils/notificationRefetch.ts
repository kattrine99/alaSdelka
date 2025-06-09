let refetchNotifications: (() => void) | null = null;

export const setRefetchNotifications = (refetch: () => void) => {
    refetchNotifications = refetch;
};

export const triggerRefetchNotifications = () => {
    if (refetchNotifications) refetchNotifications();
};
export const getRefetchNotifications = () => refetchNotifications;
