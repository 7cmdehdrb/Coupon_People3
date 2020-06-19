export const isAuthenticate = (req) => {
    if (!req.user) {
        throw Error("Login Required!");
    }
    return;
};
