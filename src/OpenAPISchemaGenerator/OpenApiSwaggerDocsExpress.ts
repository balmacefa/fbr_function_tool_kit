import { Express, Request, Response } from "express";
import SwaggerUi from "swagger-ui-express";
import { OpenAPISchemaGenerator } from './OpenAPISchemaGenerator';

export class OpenApiSwaggerDocsExpress {

    static add_swagger_route(args:
        {
            app: Express,
            url_prefix?: string,
            open_api: OpenAPISchemaGenerator
        }) {
        try {
            const swaggerSpec = args.open_api.generateDocumentation();
            args.app.use('/swagger', SwaggerUi.serve, SwaggerUi.setup(swaggerSpec));
            
            // Serve the Swagger JSON document
            const open_api_json_url = args.url_prefix ? args.url_prefix : '' + "/open_api.json";
            console.log('open_api_json_url', open_api_json_url);
            
            args.app.get(open_api_json_url,
                (req: Request, res: Response) => {
                    res.setHeader("Content-Type", "application/json");
                    const swaggerSpec = args.open_api.generateDocumentation();
                    res.send(swaggerSpec);
                });
        } catch (error) {
            console.error('Error in displaySwaggerDocs:', error);
            throw error;
        }
    }

}
