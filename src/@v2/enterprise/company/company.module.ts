import { SharedModule } from '@/@v2/shared/shared.module';
import { Module } from '@nestjs/common';
import { BrowseWorkspaceController } from './application/workspace/browse-all-workspaces/controllers/browse-all-workspaces.controller';
import { BrowseWorkspaceUseCase } from './application/workspace/browse-all-workspaces/use-cases/browse-all-workspaces.usecase';
import { WorkspaceDAO } from './database/dao/workspace/workspace.dao';

@Module({
  imports: [SharedModule],
  controllers: [
    BrowseWorkspaceController,
  ],
  providers: [
    // Database
    WorkspaceDAO,

    // Use Cases
    BrowseWorkspaceUseCase,
  ],
  exports: []
})
export class CompanyModule { }
