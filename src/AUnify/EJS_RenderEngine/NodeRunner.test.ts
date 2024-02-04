import { NodeRunner } from "../NodeRunner";


describe('NodeRunner', () => {
    it('should start the default server', () => {

        const start = NodeRunner.default_server();
        console.log("finished");
    });

});
