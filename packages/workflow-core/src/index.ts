export class WorkflowEngine {
    constructor(private nodes: any) { }

    async run(workflow: any, input: any) {
        console.log("⚙️ WorkflowEngine: starting execution...");
        console.log("Available nodes:", Object.keys(this.nodes));

        return {
            status: "ok",
            message: "Workflow executed from core engine",
            workflow,
            input
        };
    }
}
