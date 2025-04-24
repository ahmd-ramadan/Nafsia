import express, { Application } from "express"
import helmet from "helmet"
import cors from "cors"
import compression from "compression"
import morgan from "morgan"
import { ApiError, INTERNAL_SERVER_ERROR, logger, NOT_FOUND, SERVER } from "./utils"
import { corsConfig, nodeEnv, port } from "./config"
import { errorHandler, xss } from "./middlewares"
import routes from './routes'
import { connect } from "./utils"
import { tokenService, userService } from "./services"
import { swaggerDoc } from './swagger/swaggerDoc'

const app: Application = express();
const morganLogger =
  nodeEnv === SERVER.DEVELOPMENT
    ? morgan('dev')
    : morgan('combined', {
        skip: (_, res) => res.statusCode < INTERNAL_SERVER_ERROR,
      });


app.get('/', (_, res) => {
    res.send(
        '<div style="text-align: center; margin-top: 20px;"><h1>Welcome to Taskora API 🚀</h1></div>',
    );
});

app.set("trust proxy", 1);
app.use(cors(corsConfig));
app.use(morganLogger);
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '5mb' }));
app.use(xss);


swaggerDoc(app);

app.use('/api/v1', routes);
// app.all('*, (req, _res, next) => {
//     logger.error(`${req.method} ${req.originalUrl} not found`);
//     return next (
//         new ApiError(
//             `Seems like you're lost 🧐 - ${req.method} ${req.originalUrl} not found ❌`,
//             NOT_FOUND,
//         )
//     )

// });
app.use(errorHandler)

export const start = async () => {
    try {
        //   await Promise.all([
        //     prismaClient.connect(),
        //     redisClient.connect(),
        //     createStatusIfNotExists(),
        //   ]);
        
        tokenService.scheduleTokenCleanupTask();
        // userService.scheduleUserCleanupTask();

        await connect();
        const server = app.listen(Number(port) || SERVER.DEFAULT_PORT_NUMBER, '0.0.0.0', () => {
            logger.info(
                `Server is running on ${port || SERVER.DEFAULT_PORT_NUMBER} 🚀`,
            );
        });
    
        process.on('SIGINT', () => {
            logger.warn('Shutting down gracefully...');

            // Promise.all([prismaClient.disconnect(), redisClient.disconnect()])
            //   .then(() => {
            //     server.close(() => {
            //       logger.info('Server closed successfully! 👋');
            //       process.exit(0);
            //     });
            //   })
            //   .catch((error) => {
            //     logger.error(`Error occurred during shutdown - ${error} ❌`);
            //     process.exit(1);
            //   });

            server.close(() => {
                logger.info('Server closed successfully! 👋');
                process.exit(0);
            });
        });
    } catch (error) {
        logger.error(`Error occurred while starting the server - ${error} ❌`);
        process.exit(1);
    }
};