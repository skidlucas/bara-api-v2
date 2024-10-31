import { Test, TestingModule } from '@nestjs/testing'
import { EmojiLogger } from './emoji-logger.service'

describe('EmojiLogger', () => {
    let service: EmojiLogger

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EmojiLogger],
        }).compile()

        service = module.get<EmojiLogger>(EmojiLogger)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
