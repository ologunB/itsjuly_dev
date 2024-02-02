import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import {Express, Request, Response} from "express";

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Its July API',
            description: "API endpoints for a itsjuly services documented on swagger",
            contact: {
                name: "Temitope Daniel",
                email: "seoddon@gmail.com",
                url: "https://github.com/ologunb/itsjuly_dev"
            },
            version: '1.0.0',
        },
        servers: [
            {
                url: `http://localhost:5001/api/`,
                description: "Local server"
            },
            {
                url: "<your live url here>",
                description: "Live server"
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{
            BearerAuth: [], // Use the same name you used in components.securitySchemes
        }],
    },
    // looks for configuration in specified directories
    apis: ['./src/routes/*.ts'],
}
const swaggerSpec = swaggerJsdoc(options)

function swaggerDocs(app: Express, _port: number) {
    // Swagger Page
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    // Documentation in JSON format
    app.get('/docs.json', (_req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })
}

export default swaggerDocs