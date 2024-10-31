import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { RequestMethod, ValidationPipe } from '@nestjs/common'
import { clerkMiddleware } from '@clerk/express'
import { HttpExceptionFilter } from './filters/http-exception.filter'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.enableCors()
    app.setGlobalPrefix('api', { exclude: [{ path: '', method: RequestMethod.GET }] })
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    )
    app.useGlobalFilters(new HttpExceptionFilter())

    app.use(clerkMiddleware())

    await app.listen(process.env.PORT, '0.0.0.0')
}

bootstrap()
