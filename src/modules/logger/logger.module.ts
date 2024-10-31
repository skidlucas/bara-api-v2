import { Module } from '@nestjs/common'
import { EmojiLogger } from './emoji-logger.service'

@Module({
    providers: [EmojiLogger],
    exports: [EmojiLogger],
})
export class LoggerModule {}
