import { Injectable, LoggerService } from '@nestjs/common'

// this is a simple logger service that logs messages to the console but should be replaced with a proper logger service when necessary
@Injectable()
export class EmojiLogger implements LoggerService {
    private getTimestamp(): string {
        return new Date().toLocaleString()
    }

    log(message: any, data?: any) {
        console.log(`📢 [LOG] ${this.getTimestamp()}\n${message}`, data || '')
    }

    error(message: any, data?: any) {
        console.log(`❌ [ERROR] ${this.getTimestamp()}\n${message}`, data || '')
    }

    warn(message: any, data?: any) {
        console.log(`⚠️ [WARN] ${this.getTimestamp()}\n${message}`, data || '')
    }

    debug(message: any, data?: any) {
        console.log(`🐞 [DEBUG] ${this.getTimestamp()}\n${message}`, data || '')
    }
}
