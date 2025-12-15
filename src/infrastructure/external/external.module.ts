import { Module } from '@nestjs/common';
import { GroqAnalysisService } from './llm/groq-analysis.service';

@Module({
  providers: [
    {
      provide: 'IAnalysisService',
      useClass: GroqAnalysisService,
    },
  ],
  exports: [
    {
      provide: 'IAnalysisService',
      useClass: GroqAnalysisService,
    },
  ],
})
export class ExternalModule {}