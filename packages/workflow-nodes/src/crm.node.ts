export default {
    id: "crmNode",
    name: "CRM Node",
    type: "action",

    async execute(ctx: any) {
        console.log("📡 CRM Node: executed");
        console.log("Input to CRM Node:", ctx);

        // temporary test output
        return {
            message: "CRM node executed successfully",
            input: ctx
        };
    }
};
