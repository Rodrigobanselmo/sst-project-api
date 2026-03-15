import { SharedModule } from '@/@v2/shared/shared.module';
import { Module } from '@nestjs/common';
import { BrowseWorkspaceController } from './application/workspace/browse-all-workspaces/controllers/browse-all-workspaces.controller';
import { BrowseWorkspaceUseCase } from './application/workspace/browse-all-workspaces/use-cases/browse-all-workspaces.usecase';
import { DeleteWorkspaceController } from './application/workspace/delete-workspace/controllers/delete-workspace.controller';
import { DeleteWorkspaceUseCase } from './application/workspace/delete-workspace/use-cases/delete-workspace.usecase';
import { ReadVisualIdentityController } from './application/visual-identity/read-visual-identity/controllers/read-visual-identity.controller';
import { ReadVisualIdentityUseCase } from './application/visual-identity/read-visual-identity/use-cases/read-visual-identity.usecase';
import { WorkspaceDAO } from './database/dao/workspace/workspace.dao';
import { VisualIdentityDAO } from './database/dao/visual-identity/visual-identity.dao';

@Module({
  imports: [SharedModule],
  controllers: [
    BrowseWorkspaceController,
    DeleteWorkspaceController,
    ReadVisualIdentityController,
  ],
  providers: [
    // Database
    WorkspaceDAO,
    VisualIdentityDAO,

    // Use Cases
    BrowseWorkspaceUseCase,
    DeleteWorkspaceUseCase,
    ReadVisualIdentityUseCase,
  ],
  exports: []
})
export class CompanyModule { }
