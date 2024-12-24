import allNavbar from "./allNavbar";

const getNavbars = (role) => {
    const finalNavbars = [];
    for (let i = 0; i < allNavbar.length; i++) {
        if (role === allNavbar[i].role) {
            finalNavbars.push(allNavbar[i]);
        }
    }
    return finalNavbars;
};

export default getNavbars;
