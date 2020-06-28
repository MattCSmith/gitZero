module.exports = async (context) => {
    console.log("HERE", {
        event: context.event,
        action: context.payload.action,
    });
};
