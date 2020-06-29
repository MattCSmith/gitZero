const btoa = require("btoa");

const checkMembership = require("../functions/check-membership.function");
const checkForConflict = require("../functions/conflict-checker");
const log = require("../functions/log.function");

module.exports = async (context) => {
    context.logMe = log;

    console.log(
        "╔══════════════════════════════════════════════════════════════════════╗\n\n"
    );

    context.log("⌨️ - PR EVENT", {
        event: context.event,
        action: context.payload.action,
    });

    const action = context.payload.action;

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    //                    CHECK USER MEMBERSHIP!                     //
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    // This will check membership and issue org invite
    if (action === "opened") checkMembership(context);

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    //                    CHECK FOR CONFLICTS                        //
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    // This will check for conflicts, if pr isnt closed/merged
    if (action !== "closed") checkForConflict(context);
};
