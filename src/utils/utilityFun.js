const getFloatingValue = (value, decimal = 2) => {
    if (value === undefined || value === null || isNaN(value) || value === "" || value === 0 || value === "0" || Number(value) == 0) {
        return Number(0).toFixed(decimal);
    } else {
        return Number(value || 0)?.toFixed(decimal);
    }
};

const areYouSureFn = (sw, fn, params) => {
    sw.fire({
        title: "Are you sure?",
        text: "Do you want to proceed?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "Cancel",
        customClass: {
            popup: "z-[2000]", // higher than MUI dialogs
        },
    }).then((result) => {
        if (result.isConfirmed) {
            fn(params);
        }
    });
};
const swalAlert = (
    sw,
    type = "Warning",
    msg = "Something is missing.",
    fn = null,
    params = null
) => {
    sw.fire({
        title: type,
        text: msg,
        icon: String(type)?.toLocaleLowerCase(),
        customClass: {
            popup: "z-[2000]", // higher than MUI dialogs
        },
    }).then((result) => {
        if (result.isConfirmed && fn && typeof fn === "function") {
            fn(params && params);
        }
    });
};


const formatedDate = (m, date, type = null) => {
    if (!date) return "--";
    if (!type || type === "date_time") {
        return m(date)?.format("DD-MM-YYYY HH:mm:ss");
    } else if (type === "date") {
        return m(date)?.format("DD-MM-YYYY");
    } else if (type === "time") {
        return m(date)?.format("HH:mm:ss");
    }
}
export { getFloatingValue, swalAlert, areYouSureFn, formatedDate };