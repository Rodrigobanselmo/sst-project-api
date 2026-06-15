import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { ActionPlanModule } from './action-plan/action-plan.module';
import { CharacterizationModule } from './characterization/characterization.module';
import { StatusModule } from './status/status.module';
import { RiskFactorModule } from './risk/risk-factor.module';

@Module({
  imports: [SharedModule, ActionPlanModule, CharacterizationModule, StatusModule, RiskFactorModule],
  exports: [],
})
export class SecurityModule {}
