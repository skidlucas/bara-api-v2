import { Injectable } from '@nestjs/common'
import { EmojiLogger } from './modules/logger/emoji-logger.service'

@Injectable()
export class AppService {
    constructor(private readonly logger: EmojiLogger) {}

    healthCheck(): any {
        this.logger.log('healthCheck')

        function format(uptime: number) {
            function pad(s: number) {
                return (s < 10 ? '0' : '') + s
            }
            const hours = Math.floor(uptime / (60 * 60))
            const minutes = Math.floor((uptime % (60 * 60)) / 60)
            const seconds = Math.floor(uptime % 60)

            return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
        }
        return {
            environment: process.env.ENVIRONMENT,
            version: process.env.npm_package_version,
            uptime: format(process.uptime()),
        }
    }
}
